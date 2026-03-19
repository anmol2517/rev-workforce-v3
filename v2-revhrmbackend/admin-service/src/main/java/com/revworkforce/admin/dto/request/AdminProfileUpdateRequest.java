package com.revworkforce.admin.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProfileUpdateRequest {

    private String firstName;
    private String lastName;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number")
    private String phone;

    private String address;
    private String emergencyContact;
    private String emergencyContactName;
}
