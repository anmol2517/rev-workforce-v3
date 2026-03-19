package com.revworkforce.admin.dto.request;

import com.revworkforce.common.enums.LeaveType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveTypeConfigRequest {

    @NotNull(message = "Leave type is required")
    private LeaveType leaveType;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Default quota is required")
    @Min(value = 0, message = "Quota cannot be negative")
    private Integer defaultQuota;

    private boolean active;
}
