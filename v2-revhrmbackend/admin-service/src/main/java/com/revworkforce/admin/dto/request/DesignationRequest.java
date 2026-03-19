package com.revworkforce.admin.dto.request;

import com.revworkforce.common.enums.DesignationLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DesignationRequest {

    @NotBlank(message = "Designation title is required")
    private String title;

    private String description;

    private Long departmentId;

    @NotNull(message = "Designation level is required")
    @Builder.Default
    private DesignationLevel level = DesignationLevel.JUNIOR;
}