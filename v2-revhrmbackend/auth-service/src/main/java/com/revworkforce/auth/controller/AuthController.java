package com.revworkforce.auth.controller;

import com.revworkforce.auth.dto.request.*;
import com.revworkforce.auth.dto.response.LoginResponse;
import com.revworkforce.auth.entity.User;
import com.revworkforce.auth.security.RequestContext;
import com.revworkforce.auth.service.AuthService;
import com.revworkforce.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login, token refresh, password management")
public class AuthController {

    private final AuthService authService;
    private final RequestContext requestContext;

    @PostMapping("/login")
    @Operation(summary = "Login with email/employeeCode and password")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.refreshToken(request), "Token refreshed"));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change own password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        Long userId = requestContext.getCurrentUserId();
        authService.changePassword(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset token")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success("If the email exists, a reset token has been generated."));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successful"));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "auth-service"));
    }

    // ── INTERNAL ENDPOINTS (called by admin-service via Feign) ──────────────

    @PostMapping("/internal/register")
    @Operation(summary = "Internal: Register user from admin-service")
    public ResponseEntity<ApiResponse<User>> registerInternal(
            @Valid @RequestBody InternalRegisterRequest request) {
        User user = authService.registerInternal(request);
        return ResponseEntity.ok(ApiResponse.success(user, "User registered"));
    }

    @PutMapping("/internal/update-emp-code/{userId}")
    @Operation(summary = "Internal: Sync empCode after employee record created")
    public ResponseEntity<ApiResponse<Void>> updateEmployeeCode(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {
        authService.updateEmployeeCode(userId, body.get("employeeCode"));
        return ResponseEntity.ok(ApiResponse.success("EmployeeCode updated"));
    }

    @PutMapping("/internal/reset-password/{userId}")
    @Operation(summary = "Internal: Admin reset password")
    public ResponseEntity<ApiResponse<Void>> adminResetPassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {
        authService.resetPasswordByAdmin(userId, body.get("newPassword"));
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully"));
    }

    @PutMapping("/internal/deactivate/{userId}")
    @Operation(summary = "Internal: Deactivate user")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(@PathVariable Long userId) {
        authService.deactivateUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User deactivated"));
    }

    @PutMapping("/internal/activate/{userId}")
    @Operation(summary = "Internal: Activate user")
    public ResponseEntity<ApiResponse<Void>> activateUser(@PathVariable Long userId) {
        authService.activateUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User activated"));
    }
}
