package com.revworkforce.admin.dto.request;

import com.revworkforce.common.enums.HolidayType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HolidayRequest {

    @NotBlank(message = "Holiday name is required")
    private String name;

    @NotNull(message = "Holiday date is required")
    private LocalDate date;

    private String description;

    @NotNull(message = "Holiday type is required")
    @Builder.Default
    private HolidayType type = HolidayType.MANDATORY;
}
