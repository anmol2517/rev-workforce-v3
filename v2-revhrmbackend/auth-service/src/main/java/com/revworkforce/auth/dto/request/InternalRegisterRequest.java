package com.revworkforce.auth.dto.request;

import com.revworkforce.common.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternalRegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    // FIX: Removed @Pattern restricting to @revworkforce.com only.
    // That restriction was silently blocking employee creation for any other domain.
    private String email;

    private String employeeCode;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;
}
