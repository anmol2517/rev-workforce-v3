package com.revworkforce.auth.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {

    // FIX: Accept both "identifier" and "email" from frontend.
    // Angular frontend sends { email: "...", password: "..." }
    // so @JsonAlias maps "email" -> identifier field.
    @NotBlank(message = "Email or employee code is required")
    @JsonAlias("email")
    private String identifier;

    @NotBlank(message = "Password is required")
    private String password;
}
