package com.revworkforce.performance.dto.request;

import com.revworkforce.common.enums.GoalStatus;
import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UpdateGoalProgressRequest {
    @NotNull(message = "Status is required")
    private GoalStatus status;
    @Min(0) @Max(100)
    private Integer progressPercent;
    private String description;
}
