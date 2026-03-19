package com.revworkforce.admin.controller;

import com.revworkforce.admin.dto.request.*;
import com.revworkforce.admin.security.RequestContext;
import com.revworkforce.admin.service.EmployeeAdminService;
import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.EmployeeDTO;
import com.revworkforce.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/employees")
@RequiredArgsConstructor
@Tag(name = "Employee Management (Admin)", description = "Admin operations for managing employees")
public class EmployeeAdminController {

    private final EmployeeAdminService employeeAdminService;
    private final RequestContext requestContext;

    @PostMapping
    @Operation(summary = "Add new employee — if MANAGER role, managerId auto null; if EMPLOYEE role with 1 manager in dept, auto-assign")
    public ResponseEntity<ApiResponse<EmployeeDTO>> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        EmployeeDTO employee = employeeAdminService.createEmployee(request, adminUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(employee, "Employee created successfully"));
    }

    @GetMapping
    @Operation(summary = "Get all employees with search and filters")
    public ResponseEntity<ApiResponse<PageResponse<EmployeeDTO>>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status) {
        PageResponse<EmployeeDTO> response = employeeAdminService.getAllEmployees(
                page, size, search, departmentId, status);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{employeeId}")
    @Operation(summary = "Get employee details by ID")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeById(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(employeeAdminService.getEmployeeById(employeeId)));
    }

    @PostMapping("/bulk")
    @Operation(summary = "Create multiple employees")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> createEmployeesBulk(
            @Valid @RequestBody List<CreateEmployeeRequest> requests) {
        Long adminUserId = requestContext.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        employeeAdminService.createEmployeesBulk(requests, adminUserId),
                        "Employees created"));
    }

    @PutMapping("/{employeeId}")
    @Operation(summary = "Update employee information")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateEmployee(
            @PathVariable Long employeeId,
            @Valid @RequestBody UpdateEmployeeRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                employeeAdminService.updateEmployee(employeeId, request, adminUserId),
                "Employee updated successfully"));
    }

    @PutMapping("/{employeeId}/deactivate")
    @Operation(summary = "Deactivate employee account")
    public ResponseEntity<ApiResponse<Void>> deactivateEmployee(@PathVariable Long employeeId) {
        Long adminUserId = requestContext.getCurrentUserId();
        employeeAdminService.deactivateEmployee(employeeId, adminUserId);
        return ResponseEntity.ok(ApiResponse.success("Employee deactivated successfully"));
    }

    @PutMapping("/{employeeId}/activate")
    @Operation(summary = "Reactivate employee account")
    public ResponseEntity<ApiResponse<Void>> activateEmployee(@PathVariable Long employeeId) {
        Long adminUserId = requestContext.getCurrentUserId();
        employeeAdminService.activateEmployee(employeeId, adminUserId);
        return ResponseEntity.ok(ApiResponse.success("Employee activated successfully"));
    }

    @PutMapping("/{employeeId}/assign-manager")
    @Operation(summary = "Assign or change reporting manager")
    public ResponseEntity<ApiResponse<EmployeeDTO>> assignManager(
            @PathVariable Long employeeId,
            @Valid @RequestBody AssignManagerRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                employeeAdminService.assignManager(employeeId, request, adminUserId),
                "Manager assigned successfully"));
    }

    @PutMapping("/{employeeId}/reset-password")
    @Operation(summary = "Reset employee password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @PathVariable Long employeeId,
            @Valid @RequestBody PasswordResetRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        employeeAdminService.resetEmployeePassword(employeeId, request, adminUserId);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully"));
    }

    @GetMapping("/department/{departmentId}/managers")
    @Operation(summary = "Get managers in a department — for dropdown when multiple managers exist")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getManagersByDepartment(
            @PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(
                employeeAdminService.getManagersByDepartment(departmentId)));
    }
}
