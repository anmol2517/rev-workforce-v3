package com.revworkforce.auth.dto.response;

import com.revworkforce.common.enums.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;
    private Long userId;
    private String email;
    private String employeeCode;
    private Role role;
}
