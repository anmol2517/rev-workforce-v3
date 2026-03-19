package com.revworkforce.admin.controller;

import com.revworkforce.admin.entity.ActivityLog;
import com.revworkforce.admin.service.ActivityLogService;
import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/admin/activity-logs")
@RequiredArgsConstructor
@Tag(name = "Activity Logs", description = "View system activity logs")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping
    @Operation(summary = "Get all system activity logs")
    public ResponseEntity<ApiResponse<PageResponse<ActivityLog>>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        PageResponse<ActivityLog> logs = activityLogService.getAllLogs(page, size);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get activity logs by user")
    public ResponseEntity<ApiResponse<PageResponse<ActivityLog>>> getLogsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        PageResponse<ActivityLog> logs = activityLogService.getLogsByUser(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/entity/{entityType}")
    @Operation(summary = "Get activity logs by entity type")
    public ResponseEntity<ApiResponse<PageResponse<ActivityLog>>> getLogsByEntityType(
            @PathVariable String entityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        PageResponse<ActivityLog> logs = activityLogService.getLogsByEntityType(entityType, page, size);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
