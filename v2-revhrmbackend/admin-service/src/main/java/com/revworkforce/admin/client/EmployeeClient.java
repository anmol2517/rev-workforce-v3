package com.revworkforce.admin.client;

import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.EmployeeDTO;
import com.revworkforce.common.dto.PageResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "employee-service", path = "/api/employees")
public interface EmployeeClient {

    @PostMapping("/internal/create")
    ApiResponse<EmployeeDTO> createEmployee(@RequestBody Object request);

    @PutMapping("/internal/{employeeId}")
    ApiResponse<EmployeeDTO> updateEmployee(@PathVariable Long employeeId, @RequestBody Object request);

    @GetMapping("/internal/{employeeId}")
    ApiResponse<EmployeeDTO> getEmployeeById(@PathVariable Long employeeId);

    @GetMapping("/internal/by-user/{userId}")
    ApiResponse<EmployeeDTO> getEmployeeByUserId(@PathVariable Long userId);

    @GetMapping("/internal/all")
    ApiResponse<PageResponse<EmployeeDTO>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status
    );

    @PutMapping("/internal/{employeeId}/deactivate")
    ApiResponse<Void> deactivateEmployee(@PathVariable Long employeeId);

    @PutMapping("/internal/{employeeId}/activate")
    ApiResponse<Void> activateEmployee(@PathVariable Long employeeId);

    @PutMapping("/internal/{employeeId}/manager")
    ApiResponse<EmployeeDTO> assignManager(@PathVariable Long employeeId, @RequestBody Object request);

    @GetMapping("/internal/manager/{managerId}/team")
    ApiResponse<List<EmployeeDTO>> getTeamByManager(@PathVariable Long managerId);

    @GetMapping("/internal/count")
    ApiResponse<Long> countEmployees(@RequestParam(required = false) String status);

    @GetMapping("/internal/by-department/{departmentId}/count")
    ApiResponse<Long> countByDepartment(@PathVariable Long departmentId);

    @GetMapping("/internal/stats/by-department")
    ApiResponse<Object> getEmployeeStatsByDepartment();

    @GetMapping("/internal/department/{departmentId}/managers")
    ApiResponse<List<EmployeeDTO>> getManagersByDepartment(@PathVariable Long departmentId);

    @GetMapping("/internal/by-email/{email}")
    ApiResponse<EmployeeDTO> getEmployeeByEmail(@PathVariable String email);
}
