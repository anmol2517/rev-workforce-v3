package com.revworkforce.performance.dto.request;

import com.revworkforce.common.enums.Priority;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignGoalRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    private String title;
    private String description;
    private LocalDate deadline;
    private Priority priority;
}