package com.revworkforce.admin.dto.request;

import com.revworkforce.common.enums.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternalAuthRegisterRequest {
    private String email;
    private String password;
    private Role role;
}
