package com.revworkforce.auth.service;

import com.revworkforce.auth.dto.request.ChangePasswordRequest;
import com.revworkforce.auth.dto.request.LoginRequest;
import com.revworkforce.auth.dto.response.LoginResponse;
import com.revworkforce.auth.entity.User;
import com.revworkforce.auth.repository.PasswordResetTokenRepository;
import com.revworkforce.auth.repository.UserRepository;
import com.revworkforce.auth.serviceImpl.AuthServiceImpl;
import com.revworkforce.common.enums.Role;
import com.revworkforce.common.exception.BadRequestException;
import com.revworkforce.common.exception.UnauthorizedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "jwtSecret",
                "RevWorkforce@SecretKey#2024SuperSecureChangeInProduction");
        ReflectionTestUtils.setField(authService, "jwtExpiration", 3600000L);
        ReflectionTestUtils.setField(authService, "refreshExpiration", 604800000L);
    }

    @Test
    void login_InvalidCredentials_ThrowsUnauthorized() {
        when(userRepository.findByEmail("wrong@test.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmployeeCode("wrong@test.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(
                LoginRequest.builder().identifier("wrong@test.com").password("pass").build()))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void login_DeactivatedUser_ThrowsUnauthorized() {
        User deactivatedUser = User.builder()
                .userId(1L).email("emp@test.com").password("encoded")
                .role(Role.EMPLOYEE).active(false).build();

        when(userRepository.findByEmail("emp@test.com")).thenReturn(Optional.of(deactivatedUser));

        assertThatThrownBy(() -> authService.login(
                LoginRequest.builder().identifier("emp@test.com").password("pass").build()))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("deactivated");
    }

    @Test
    void login_WrongPassword_ThrowsUnauthorized() {
        User user = User.builder()
                .userId(1L).email("emp@test.com").password("encoded")
                .role(Role.EMPLOYEE).active(true).build();

        when(userRepository.findByEmail("emp@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpass", "encoded")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(
                LoginRequest.builder().identifier("emp@test.com").password("wrongpass").build()))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void changePassword_WrongCurrentPassword_ThrowsBadRequest() {
        User user = User.builder()
                .userId(1L).email("emp@test.com").password("encoded")
                .role(Role.EMPLOYEE).active(true).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongOld", "encoded")).thenReturn(false);

        assertThatThrownBy(() -> authService.changePassword(1L,
                ChangePasswordRequest.builder()
                        .currentPassword("wrongOld").newPassword("newPass123").build()))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("incorrect");
    }

    @Test
    void deactivateUser_Success() {
        User user = User.builder()
                .userId(1L).email("emp@test.com").password("encoded")
                .role(Role.EMPLOYEE).active(true).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        authService.deactivateUser(1L);

        verify(userRepository, times(1)).save(argThat(u -> !u.isActive()));
    }
}
