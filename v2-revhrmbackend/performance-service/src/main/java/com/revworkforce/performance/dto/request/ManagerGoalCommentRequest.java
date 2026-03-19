package com.revworkforce.performance.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ManagerGoalCommentRequest {
    @NotBlank(message = "Comment is required")
    private String comment;
}
