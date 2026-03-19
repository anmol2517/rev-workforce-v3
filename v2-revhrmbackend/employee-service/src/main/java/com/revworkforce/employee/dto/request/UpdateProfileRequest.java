package com.revworkforce.employee.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number")
    private String phone;

    private String address;
}
