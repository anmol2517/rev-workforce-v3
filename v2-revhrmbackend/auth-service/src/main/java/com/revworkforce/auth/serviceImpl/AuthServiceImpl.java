package com.revworkforce.auth.serviceImpl;

import com.revworkforce.auth.dto.request.*;
import com.revworkforce.auth.dto.response.LoginResponse;
import com.revworkforce.auth.entity.PasswordResetToken;
import com.revworkforce.auth.entity.User;
import com.revworkforce.auth.repository.PasswordResetTokenRepository;
import com.revworkforce.auth.repository.UserRepository;
import com.revworkforce.auth.service.AuthService;
import com.revworkforce.common.exception.BadRequestException;
import com.revworkforce.common.exception.DuplicateResourceException;
import com.revworkforce.common.exception.ResourceNotFoundException;
import com.revworkforce.common.exception.UnauthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:3600000}")
    private long jwtExpiration;

    @Value("${jwt.refresh.expiration:604800000}")
    private long refreshExpiration;

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getIdentifier())
                .or(() -> userRepository.findByEmployeeCode(request.getIdentifier()))
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!user.isActive()) {
            throw new UnauthorizedException("Account is deactivated. Please contact administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String accessToken = generateAccessToken(user);
        String refreshToken = generateRefreshToken(user);

        user.setRefreshToken(refreshToken);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        log.info("User logged in: {}", user.getEmail());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration / 1000)
                .userId(user.getUserId())
                .email(user.getEmail())
                .employeeCode(user.getEmployeeCode())
                .role(user.getRole())
                .build();
    }

    @Override
    @Transactional
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        try {
            Claims claims = extractClaims(request.getRefreshToken());
            String email = claims.getSubject();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

            if (!user.isActive()) throw new UnauthorizedException("Account is deactivated");
            if (!request.getRefreshToken().equals(user.getRefreshToken()))
                throw new UnauthorizedException("Refresh token mismatch");

            String newAccessToken = generateAccessToken(user);
            String newRefreshToken = generateRefreshToken(user);
            user.setRefreshToken(newRefreshToken);
            userRepository.save(user);

            return LoginResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtExpiration / 1000)
                    .userId(user.getUserId())
                    .email(user.getEmail())
                    .employeeCode(user.getEmployeeCode())
                    .role(user.getRole())
                    .build();
        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword()))
            throw new BadRequestException("Current password is incorrect");
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setRefreshToken(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));
        passwordResetTokenRepository.deleteByUserId(user.getUserId());
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token).userId(user.getUserId())
                .expiresAt(LocalDateTime.now().plusHours(1)).used(false).build();
        passwordResetTokenRepository.save(resetToken);
        log.info("Password reset token for: {} - Token: {}", user.getEmail(), token);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByTokenAndUsedFalse(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new BadRequestException("Reset token has expired");
        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", resetToken.getUserId()));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setRefreshToken(null);
        userRepository.save(user);
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    @Override
    @Transactional
    public User registerInternal(InternalRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new DuplicateResourceException("User", "email", request.getEmail());

        String empCode = request.getEmployeeCode();
        if (empCode == null || empCode.isBlank()) {
            empCode = switch (request.getRole()) {
                case ADMIN -> "SYSAD-" + String.format("%03d", userRepository.count() + 1);
                case MANAGER -> "MGR-" + String.format("%03d", userRepository.count() + 1);
                default -> "EMP-" + String.format("%03d", userRepository.count() + 1);
            };
        }
        if (userRepository.existsByEmployeeCode(empCode))
            throw new DuplicateResourceException("User", "employeeCode", empCode);

        User user = User.builder()
                .email(request.getEmail())
                .employeeCode(empCode)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .build();
        User saved = userRepository.save(user);
        log.info("User registered: {}", saved.getEmail());
        return saved;
    }

    @Override
    @Transactional
    public void updateEmployeeCode(Long userId, String employeeCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setEmployeeCode(employeeCode);
        userRepository.save(user);
        log.info("EmployeeCode updated for userId {}: {}", userId, employeeCode);
    }

    @Override
    @Transactional
    public void resetPasswordByAdmin(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setRefreshToken(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setActive(false);
        user.setRefreshToken(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setActive(true);
        userRepository.save(user);
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private String generateAccessToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getUserId());
        claims.put("role", user.getRole().name());
        // FIX: Use userId (Long) as employeeId claim, NOT empCode string.
        // All downstream services parse X-Employee-Id as Long via Long.parseLong().
        // Sending empCode string like "EMP-001" would cause NumberFormatException.
        claims.put("employeeId", user.getUserId());
        claims.put("email", user.getEmail());
        claims.put("empCode", user.getEmployeeCode());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private String generateRefreshToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Base64.getEncoder().encode(jwtSecret.getBytes());
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(keyBytes));
    }
}
