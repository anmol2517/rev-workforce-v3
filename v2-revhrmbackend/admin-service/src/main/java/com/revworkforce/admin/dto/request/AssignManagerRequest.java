package com.revworkforce.admin.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignManagerRequest {

    @NotNull(message = "Manager ID is required")
    private Long managerId;
}
