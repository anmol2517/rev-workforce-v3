package com.revworkforce.admin.controller;

import com.revworkforce.admin.dto.request.LeaveBalanceAdjustRequest;
import com.revworkforce.admin.dto.request.LeaveQuotaRequest;
import com.revworkforce.admin.security.RequestContext;
import com.revworkforce.admin.service.LeaveAdminService;
import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.LeaveBalanceDTO;
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
@RequestMapping("/api/admin/leaves")
@RequiredArgsConstructor
@Tag(name = "Leave Management (Admin)", description = "Admin operations for leave management")
public class LeaveAdminController {

    private final LeaveAdminService leaveAdminService;
    private final RequestContext requestContext;

    @PostMapping("/quota")
    @Operation(summary = "Assign leave quota to employee")
    public ResponseEntity<ApiResponse<LeaveBalanceDTO>> assignLeaveQuota(
            @Valid @RequestBody LeaveQuotaRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        LeaveBalanceDTO balance = leaveAdminService.assignLeaveQuota(request, adminUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(balance, "Leave quota assigned successfully"));
    }

    @PutMapping("/balance/adjust")
    @Operation(summary = "Manually adjust leave balance")
    public ResponseEntity<ApiResponse<LeaveBalanceDTO>> adjustLeaveBalance(
            @Valid @RequestBody LeaveBalanceAdjustRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        LeaveBalanceDTO balance = leaveAdminService.adjustLeaveBalance(request, adminUserId);
        return ResponseEntity.ok(ApiResponse.success(balance, "Leave balance adjusted successfully"));
    }

    @GetMapping("/balance/employee/{employeeId}")
    @Operation(summary = "Get leave balance for an employee")
    public ResponseEntity<ApiResponse<List<LeaveBalanceDTO>>> getLeaveBalanceByEmployee(
            @PathVariable Long employeeId) {
        List<LeaveBalanceDTO> balances = leaveAdminService.getLeaveBalanceByEmployee(employeeId);
        return ResponseEntity.ok(ApiResponse.success(balances));
    }

    @GetMapping
    @Operation(summary = "View all employee leave applications")
    public ResponseEntity<ApiResponse<PageResponse<Object>>> getAllLeaves(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) Long departmentId) {
        PageResponse<Object> response = leaveAdminService.getAllLeaves(
                page, size, status, employeeId, departmentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/report")
    @Operation(summary = "Generate leave report (department-wise or employee-wise)")
    public ResponseEntity<ApiResponse<Object>> getLeaveReport(
            @RequestParam(defaultValue = "EMPLOYEE") String type,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long departmentId) {
        Object report = leaveAdminService.getLeaveReport(type, year, departmentId);
        return ResponseEntity.ok(ApiResponse.success(report));
    }
}
