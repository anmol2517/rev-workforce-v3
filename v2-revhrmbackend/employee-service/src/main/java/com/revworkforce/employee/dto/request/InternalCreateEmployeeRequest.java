package com.revworkforce.employee.dto.request;

import com.revworkforce.common.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternalCreateEmployeeRequest {

    // FIX: userId from auth-service so employee PK == auth userId.
    // Without this, findById(userId) in getMyProfile() would find wrong employee
    // once the auto-increment IDs diverge between auth_db and employee_db.
    private Long userId;

    private String firstName;
    private String lastName;
    private String email;
    private String empCode;
    private Long departmentId;
    private String departmentName;
    private Long designationId;
    private String designationName;
    private Long managerId;
    private String managerName;
    private LocalDate joiningDate;
    private BigDecimal salary;
    private Role role;
    private String phone;
    private String address;
    private String password;
}
