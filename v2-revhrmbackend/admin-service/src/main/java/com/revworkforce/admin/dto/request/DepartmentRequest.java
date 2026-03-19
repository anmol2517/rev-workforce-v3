package com.revworkforce.admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentRequest {

    @NotBlank(message = "Department name is required")
    private String name;
    private String description;
}
