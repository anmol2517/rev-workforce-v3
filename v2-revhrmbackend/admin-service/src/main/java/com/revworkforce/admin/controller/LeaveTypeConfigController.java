package com.revworkforce.admin.controller;

import com.revworkforce.admin.dto.request.LeaveTypeConfigRequest;
import com.revworkforce.admin.entity.LeaveTypeConfig;
import com.revworkforce.admin.security.RequestContext;
import com.revworkforce.admin.service.LeaveTypeConfigService;
import com.revworkforce.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/leave-types")
@RequiredArgsConstructor
@Tag(name = "Leave Type Configuration", description = "Admin configure leave types")
public class LeaveTypeConfigController {

    private final LeaveTypeConfigService leaveTypeConfigService;
    private final RequestContext requestContext;

    @PostMapping
    @Operation(summary = "Create or update leave type configuration")
    public ResponseEntity<ApiResponse<LeaveTypeConfig>> createOrUpdateLeaveType(
            @Valid @RequestBody LeaveTypeConfigRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                leaveTypeConfigService.createOrUpdateLeaveType(request, adminUserId),
                "Leave type configured successfully"));
    }

    @GetMapping
    @Operation(summary = "Get all leave type configurations")
    public ResponseEntity<ApiResponse<List<LeaveTypeConfig>>> getAllLeaveTypes() {
        return ResponseEntity.ok(ApiResponse.success(
                leaveTypeConfigService.getAllLeaveTypes()));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active leave types")
    public ResponseEntity<ApiResponse<List<LeaveTypeConfig>>> getActiveLeaveTypes() {
        return ResponseEntity.ok(ApiResponse.success(
                leaveTypeConfigService.getActiveLeaveTypes()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update leave type configuration")
    public ResponseEntity<ApiResponse<LeaveTypeConfig>> updateLeaveType(
            @PathVariable Long id,
            @Valid @RequestBody LeaveTypeConfigRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                leaveTypeConfigService.updateLeaveType(id, request, adminUserId),
                "Leave type updated successfully"));
    }
}
