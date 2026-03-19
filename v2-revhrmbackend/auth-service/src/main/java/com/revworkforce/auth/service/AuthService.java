package com.revworkforce.auth.service;

import com.revworkforce.auth.dto.request.*;
import com.revworkforce.auth.dto.response.LoginResponse;
import com.revworkforce.auth.entity.User;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse refreshToken(RefreshTokenRequest request);
    void changePassword(Long userId, ChangePasswordRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    User registerInternal(InternalRegisterRequest request);
    void updateEmployeeCode(Long userId, String employeeCode);
    void resetPasswordByAdmin(Long userId, String newPassword);
    void deactivateUser(Long userId);
    void activateUser(Long userId);
    User getUserById(Long userId);
}
