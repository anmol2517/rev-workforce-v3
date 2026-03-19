package com.revworkforce.performance.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ManagerFeedbackRequest {
    @NotBlank(message = "Feedback is required")
    private String managerFeedback;
    @NotNull(message = "Rating is required")
    @Min(1) @Max(5)
    private Integer managerRating;
}
