package com.revworkforce.admin.dto.request;

import com.revworkforce.common.enums.Role;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateEmployeeRequest {

    private String firstName;
    private String lastName;

    @Email(message = "Invalid email format")
    private String email;

    private Long departmentId;
    private Long designationId;
    private Long managerId;
    private LocalDate joiningDate;

    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be positive")
    private BigDecimal salary;

    private Role role;
    private String phone;
    private String address;
    private String emergencyContact;
    private String emergencyContactName;
}
