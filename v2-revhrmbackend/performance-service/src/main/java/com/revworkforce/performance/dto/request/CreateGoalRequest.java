package com.revworkforce.performance.dto.request;

import com.revworkforce.common.enums.Priority;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateGoalRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    @NotNull(message = "Deadline is required")
    private LocalDate deadline;
    @NotNull(message = "Priority is required")
    private Priority priority;
}
