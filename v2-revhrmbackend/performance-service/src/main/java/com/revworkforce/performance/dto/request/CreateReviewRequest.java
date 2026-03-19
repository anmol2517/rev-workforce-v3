package com.revworkforce.performance.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateReviewRequest {
    private String keyDeliverables;
    private String accomplishments;
    private String areasOfImprovement;
    @Min(1) @Max(5)
    private Integer selfRating;
}
