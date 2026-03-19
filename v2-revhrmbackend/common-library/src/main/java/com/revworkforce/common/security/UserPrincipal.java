package com.revworkforce.common.security;

import com.revworkforce.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPrincipal {
    private Long userId;
    private String email;
    private String employeeId;
    private Role role;
    private Long managerId;
}
