package com.revworkforce.leave.controller;

import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.leave.client.EmployeeClient;
import com.revworkforce.leave.dto.request.ApplyLeaveRequest;
import com.revworkforce.leave.dto.request.LeaveActionRequest;
import com.revworkforce.leave.entity.LeaveApplication;
import com.revworkforce.leave.entity.LeaveBalance;
import com.revworkforce.leave.security.RequestContext;
import com.revworkforce.leave.service.LeaveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
@Tag(name = "Leave Management", description = "Apply, approve, reject, balance management")
public class LeaveController {

    private final LeaveService leaveService;
    private final RequestContext requestContext;
    private final EmployeeClient employeeClient;

    @PostMapping("/apply")
    @Operation(summary = "Employee: Apply for leave")
    public ResponseEntity<ApiResponse<LeaveApplication>> applyLeave(
            @Valid @RequestBody ApplyLeaveRequest request) {
        Long employeeId = requestContext.getCurrentEmployeeId();
        String employeeName = requestContext.getCurrentUserEmail();
        Long managerId = null;

        try {
            Long userId = requestContext.getCurrentUserId();
            var empResponse = employeeClient.getEmployeeByUserId(userId);
            if (empResponse != null && empResponse.isSuccess() && empResponse.getData() != null) {
                managerId = empResponse.getData().getManagerId();
                String fn = empResponse.getData().getFirstName();
                String ln = empResponse.getData().getLastName();
                if (fn != null) employeeName = fn + " " + (ln != null ? ln : "");
            }
        } catch (Exception e) {
            log.warn("Could not fetch manager from employee-service: {}", e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                leaveService.applyLeave(employeeId, employeeName, managerId, request),
                "Leave applied successfully"));
    }

    @GetMapping("/my")
    @Operation(summary = "Employee: View my leave applications")
    public ResponseEntity<ApiResponse<PageResponse<LeaveApplication>>> getMyLeaves(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long employeeId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(leaveService.getMyLeaves(employeeId, page, size)));
    }

    @PutMapping("/{leaveId}/cancel")
    @Operation(summary = "Employee: Cancel pending leave")
    public ResponseEntity<ApiResponse<LeaveApplication>> cancelLeave(@PathVariable Long leaveId) {
        Long employeeId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(
                leaveService.cancelLeave(leaveId, employeeId), "Leave cancelled"));
    }

    @GetMapping("/balance")
    @Operation(summary = "Employee: View my leave balances")
    public ResponseEntity<ApiResponse<List<LeaveBalance>>> getMyBalance() {
        Long employeeId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(leaveService.getMyLeaveBalances(employeeId)));
    }

    @GetMapping("/{leaveId}")
    @Operation(summary = "Get leave by ID")
    public ResponseEntity<ApiResponse<LeaveApplication>> getLeaveById(@PathVariable Long leaveId) {
        return ResponseEntity.ok(ApiResponse.success(leaveService.getLeaveById(leaveId)));
    }

    @GetMapping("/team")
    @Operation(summary = "Manager: View team leave applications")
    public ResponseEntity<ApiResponse<PageResponse<LeaveApplication>>> getTeamLeaves(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long managerId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(leaveService.getTeamLeaves(managerId, page, size)));
    }

    @GetMapping("/team/calendar")
    @Operation(summary = "Manager: Team leave calendar")
    public ResponseEntity<ApiResponse<List<LeaveApplication>>> getTeamCalendar() {
        Long managerId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(leaveService.getTeamLeaveCalendar(managerId)));
    }

    @PutMapping("/{leaveId}/approve")
    @Operation(summary = "Manager: Approve leave request")
    public ResponseEntity<ApiResponse<LeaveApplication>> approveLeave(
            @PathVariable Long leaveId,
            @RequestBody(required = false) LeaveActionRequest request) {
        Long managerId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(
                leaveService.approveLeave(leaveId, managerId, request), "Leave approved"));
    }

    @PutMapping("/{leaveId}/reject")
    @Operation(summary = "Manager: Reject leave request (comments mandatory)")
    public ResponseEntity<ApiResponse<LeaveApplication>> rejectLeave(
            @PathVariable Long leaveId,
            @RequestBody LeaveActionRequest request) {
        Long managerId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(
                leaveService.rejectLeave(leaveId, managerId, request), "Leave rejected"));
    }

    @GetMapping("/team/balance/{employeeId}")
    @Operation(summary = "Manager: View team member leave balance")
    public ResponseEntity<ApiResponse<List<LeaveBalance>>> getTeamMemberBalance(
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(leaveService.getMyLeaveBalances(employeeId)));
    }

    @GetMapping("/health")
    @Operation(summary = "Health check")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "leave-service"));
    }

    @PostMapping("/internal/balance/assign")
    @Operation(summary = "Internal: Assign leave quota")
    public ResponseEntity<ApiResponse<LeaveBalance>> assignQuota(@RequestBody Map<String, Object> body) {
        Long employeeId = Long.valueOf(body.get("employeeId").toString());
        String leaveType = body.get("leaveType").toString();
        int totalDays = Integer.parseInt(body.get("totalDays").toString());
        int year = Integer.parseInt(body.get("year").toString());
        return ResponseEntity.ok(ApiResponse.success(
                leaveService.assignLeaveQuota(employeeId, leaveType, totalDays, year)));
    }

    @PutMapping("/internal/balance/adjust")
    @Operation(summary = "Internal: Adjust leave balance")
    public ResponseEntity<ApiResponse<LeaveBalance>> adjustBalance(@RequestBody Map<String, Object> body) {
        Long employeeId = Long.valueOf(body.get("employeeId").toString());
        String leaveType = body.get("leaveType").toString();
        int days = Integer.parseInt(body.get("days").toString());
        String reason = body.get("reason").toString();
        int year = body.containsKey("year") ? Integer.parseInt(body.get("year").toString())
                : java.time.LocalDate.now().getYear();
        return ResponseEntity.ok(ApiResponse.success(
                leaveService.adjustLeaveBalance(employeeId, leaveType, days, reason, year)));
    }

    @GetMapping("/internal/balance/{employeeId}")
    @Operation(summary = "Internal: Get leave balance by employee")
    public ResponseEntity<ApiResponse<List<LeaveBalance>>> getBalanceInternal(
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(leaveService.getLeaveBalanceByEmployee(employeeId)));
    }

    @GetMapping("/internal/all")
    @Operation(summary = "Internal: Get all leaves with filters")
    public ResponseEntity<ApiResponse<PageResponse<LeaveApplication>>> getAllLeavesInternal(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(
                leaveService.getAllLeaves(page, size, status, employeeId, departmentId)));
    }

    @GetMapping("/internal/pending/count")
    @Operation(summary = "Internal: Count pending leaves")
    public ResponseEntity<ApiResponse<Long>> countPending() {
        return ResponseEntity.ok(ApiResponse.success(leaveService.countPendingLeaves()));
    }

    @GetMapping("/internal/approved-today/count")
    @Operation(summary = "Internal: Count approved leaves today")
    public ResponseEntity<ApiResponse<Long>> countApprovedToday() {
        return ResponseEntity.ok(ApiResponse.success(leaveService.countApprovedLeavesToday()));
    }

    @GetMapping("/internal/count-by-status")
    @Operation(summary = "Internal: Count leaves by status")
    public ResponseEntity<ApiResponse<Long>> countByStatus(@RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(leaveService.countLeavesByStatus(status)));
    }

    @GetMapping("/internal/report")
    @Operation(summary = "Internal: Leave report")
    public ResponseEntity<ApiResponse<Object>> getReport(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(
                leaveService.getLeaveReport(type, year, departmentId)));
    }

    @GetMapping("/internal/stats/by-type")
    @Operation(summary = "Internal: Leave stats by type")
    public ResponseEntity<ApiResponse<Object>> getStatsByType() {
        return ResponseEntity.ok(ApiResponse.success(leaveService.getLeaveReport("TYPE", null, null)));
    }
}
