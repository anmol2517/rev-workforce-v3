package com.revworkforce.admin.dto.request;

import com.revworkforce.common.enums.LeaveType;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalanceAdjustRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Leave type is required")
    private LeaveType leaveType;

    @NotNull(message = "Days is required")
    private Integer days;

    @NotBlank(message = "Reason is required")
    private String reason;

    private int year;
}
