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
public class CreateEmployeeRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String empCode;
    private Long userId;

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotNull(message = "Designation is required")
    private Long designationId;

    private Long managerId;
    private String departmentName;
    private String designationName;
    private String managerName;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    @NotNull(message = "Salary is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be positive")
    private BigDecimal salary;

    @NotNull(message = "Role is required")
    private Role role;

    private String phone;
    private String address;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
