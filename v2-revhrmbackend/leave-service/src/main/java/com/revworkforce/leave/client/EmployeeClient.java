package com.revworkforce.leave.client;

import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.EmployeeDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "employee-service", path = "/api/employees")
public interface EmployeeClient {

    @GetMapping("/internal/by-user/{userId}")
    ApiResponse<EmployeeDTO> getEmployeeByUserId(@PathVariable Long userId);
}