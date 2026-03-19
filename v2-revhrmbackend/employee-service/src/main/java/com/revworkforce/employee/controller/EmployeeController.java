package com.revworkforce.employee.controller;

import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.EmployeeDTO;
import com.revworkforce.common.dto.EmployeeReportDTO;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.employee.dto.request.InternalCreateEmployeeRequest;
import com.revworkforce.employee.dto.request.UpdateProfileRequest;
import com.revworkforce.employee.security.RequestContext;
import com.revworkforce.employee.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Tag(name = "Employee", description = "Employee profile, directory, team management")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final RequestContext requestContext;

    @GetMapping("/me")
    @Operation(summary = "Get my profile")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getMyProfile() {
        Long userId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(employeeService.getMyProfile(userId)));
    }

    @PutMapping("/me")
    @Operation(summary = "Update my profile (phone, address, emergency contact only)")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        Long userId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.updateMyProfile(userId, request),
                "Profile updated successfully"));
    }

    @GetMapping("/me/report")
    @Operation(summary = "Get my profile report data (PDF/Excel source)")
    public ResponseEntity<ApiResponse<EmployeeReportDTO>> getMyReport() {
        Long userId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.getEmployeeReport(userId)));
    }

    @GetMapping("/{employeeId}")
    @Operation(summary = "Get employee by ID")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeById(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getEmployeeById(employeeId)));
    }

    @GetMapping("/directory")
    @Operation(summary = "Employee directory — name, email, department, phone only visible")
    public ResponseEntity<ApiResponse<PageResponse<EmployeeDTO>>> getDirectory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.getDirectory(page, size, search)));
    }

    @GetMapping("/manager/team")
    @Operation(summary = "Manager: Get my direct reportees")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getMyTeam() {
        Long userId = requestContext.getCurrentUserId();
        EmployeeDTO manager = employeeService.getMyProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.getDirectReportees(manager.getEmployeeId())));
    }

    @GetMapping("/manager/team/{employeeId}/report")
    @Operation(summary = "Manager: Download team member report")
    public ResponseEntity<ApiResponse<EmployeeReportDTO>> getTeamMemberReport(
            @PathVariable Long employeeId) {
        EmployeeDTO profile = employeeService.getEmployeeById(employeeId);
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.getEmployeeReport(profile.getEmployeeId())));
    }

    @GetMapping("/health")
    @Operation(summary = "Health check")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "employee-service"));
    }

    @PostMapping("/internal/create")
    @Operation(summary = "Internal: Create employee")
    public ResponseEntity<ApiResponse<EmployeeDTO>> createEmployee(
            @RequestBody InternalCreateEmployeeRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.createEmployee(request), "Employee created"));
    }

    @PutMapping("/internal/{employeeId}")
    @Operation(summary = "Internal: Update employee")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateEmployee(
            @PathVariable Long employeeId, @RequestBody Object request) {
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.updateEmployee(employeeId, request), "Employee updated"));
    }

    @GetMapping("/internal/{employeeId}")
    @Operation(summary = "Internal: Get employee by ID")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeByIdInternal(
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getEmployeeById(employeeId)));
    }

    @GetMapping("/internal/by-user/{userId}")
    @Operation(summary = "Internal: Get employee by userId")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getEmployeeByUserId(userId)));
    }

    @GetMapping("/internal/by-email/{email}")
    @Operation(summary = "Internal: Get employee by email")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeByEmail(@PathVariable String email) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getEmployeeByEmail(email)));
    }

    @GetMapping("/internal/all")
    @Operation(summary = "Internal: Get all employees")
    public ResponseEntity<ApiResponse<PageResponse<EmployeeDTO>>> getAllEmployeesInternal(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.getAllEmployees(page, size, search, departmentId, status)));
    }

    @PutMapping("/internal/{employeeId}/deactivate")
    @Operation(summary = "Internal: Deactivate employee")
    public ResponseEntity<ApiResponse<Void>> deactivateEmployee(@PathVariable Long employeeId) {
        employeeService.deactivateEmployee(employeeId);
        return ResponseEntity.ok(ApiResponse.success("Employee deactivated"));
    }

    @PutMapping("/internal/{employeeId}/activate")
    @Operation(summary = "Internal: Activate employee")
    public ResponseEntity<ApiResponse<Void>> activateEmployee(@PathVariable Long employeeId) {
        employeeService.activateEmployee(employeeId);
        return ResponseEntity.ok(ApiResponse.success("Employee activated"));
    }

    @PutMapping("/internal/{employeeId}/manager")
    @Operation(summary = "Internal: Assign manager")
    public ResponseEntity<ApiResponse<EmployeeDTO>> assignManager(
            @PathVariable Long employeeId, @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.assignManager(employeeId, body.get("managerId")),
                "Manager assigned"));
    }

    @GetMapping("/internal/manager/{managerId}/team")
    @Operation(summary = "Internal: Get team by manager")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getTeamInternal(
            @PathVariable Long managerId) {
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.getTeamByManager(managerId)));
    }

    @GetMapping("/internal/count")
    @Operation(summary = "Internal: Count employees")
    public ResponseEntity<ApiResponse<Long>> countEmployees(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.countEmployees(status)));
    }

    @GetMapping("/internal/by-department/{departmentId}/count")
    @Operation(summary = "Internal: Count by department")
    public ResponseEntity<ApiResponse<Long>> countByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.countByDepartment(departmentId)));
    }

    @GetMapping("/internal/stats/by-department")
    @Operation(summary = "Internal: Stats by department")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStatsByDepartment() {
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.getEmployeeStatsByDepartment()));
    }

    @GetMapping("/internal/department/{departmentId}/managers")
    @Operation(summary = "Internal: Get managers in a department")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getManagersByDepartment(
            @PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.getManagersByDepartment(departmentId)));
    }

    @GetMapping("/internal/report/{userId}")
    @Operation(summary = "Internal: Get employee report by userId")
    public ResponseEntity<ApiResponse<EmployeeReportDTO>> getEmployeeReportInternal(
            @PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(
                employeeService.getEmployeeReport(userId)));
    }
}
