package com.revworkforce.admin.dto.request;

import com.revworkforce.common.enums.LeaveType;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveQuotaRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Leave type is required")
    private LeaveType leaveType;

    @NotNull(message = "Total days is required")
    @Min(value = 0, message = "Total days cannot be negative")
    private Integer totalDays;

    @NotNull(message = "Year is required")
    private Integer year;
}
