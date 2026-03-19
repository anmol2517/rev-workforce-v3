package com.revworkforce.common.dto;

import com.revworkforce.common.enums.EmployeeStatus;
import com.revworkforce.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private Long employeeId;
    private String empCode;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String departmentName;
    private Long departmentId;
    private String designationName;
    private Long designationId;
    private Long managerId;
    private String managerName;
    private LocalDate joiningDate;
    private BigDecimal salary;
    private Role role;
    private EmployeeStatus status;
}
