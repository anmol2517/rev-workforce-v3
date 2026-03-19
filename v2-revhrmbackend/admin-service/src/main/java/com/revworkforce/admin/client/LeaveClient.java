package com.revworkforce.admin.client;

import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.LeaveBalanceDTO;
import com.revworkforce.common.dto.PageResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "leave-service", path = "/api/leaves")
public interface LeaveClient {

    @PostMapping("/internal/balance/assign")
    ApiResponse<LeaveBalanceDTO> assignLeaveQuota(@RequestBody Object request);

    @PutMapping("/internal/balance/adjust")
    ApiResponse<LeaveBalanceDTO> adjustLeaveBalance(@RequestBody Object request);

    @GetMapping("/internal/balance/{employeeId}")
    ApiResponse<List<LeaveBalanceDTO>> getLeaveBalanceByEmployee(@PathVariable Long employeeId);

    @GetMapping("/internal/all")
    ApiResponse<PageResponse<Object>> getAllLeaves(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) Long departmentId
    );

    @GetMapping("/internal/pending/count")
    ApiResponse<Long> countPendingLeaves();

    @GetMapping("/internal/approved-today/count")
    ApiResponse<Long> countApprovedLeavesToday();

    @GetMapping("/internal/leave-types")
    ApiResponse<List<Object>> getLeaveTypes();

    @GetMapping("/internal/count-by-status")
    ApiResponse<Long> countLeavesByStatus(@RequestParam String status);

    @GetMapping("/internal/report")
    ApiResponse<Object> getLeaveReport(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long departmentId
    );

    @GetMapping("/internal/stats/by-type")
    ApiResponse<Object> getLeaveStatsByType();

    @GetMapping("/internal/holidays")
    ApiResponse<List<Object>> getAllHolidays();
}
