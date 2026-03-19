package com.revworkforce.admin.client;

import com.revworkforce.common.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "auth-service", path = "/api/auth")
public interface AuthClient {

    @PostMapping("/internal/register")
    ApiResponse<Object> registerUser(@RequestBody Object request);

    @PutMapping("/internal/update-emp-code/{userId}")
    ApiResponse<Void> updateEmployeeCode(@PathVariable Long userId, @RequestBody Map<String, String> body);

    @PutMapping("/internal/reset-password/{userId}")
    ApiResponse<Void> resetPassword(@PathVariable Long userId, @RequestBody Object request);

    @PutMapping("/internal/deactivate/{userId}")
    ApiResponse<Void> deactivateUser(@PathVariable Long userId);

    @PutMapping("/internal/activate/{userId}")
    ApiResponse<Void> activateUser(@PathVariable Long userId);
}
