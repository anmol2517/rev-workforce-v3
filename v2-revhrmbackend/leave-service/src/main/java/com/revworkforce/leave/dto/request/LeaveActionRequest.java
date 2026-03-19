package com.revworkforce.leave.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LeaveActionRequest {
    private String comments;
}
