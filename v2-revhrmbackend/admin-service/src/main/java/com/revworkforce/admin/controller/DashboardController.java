package com.revworkforce.admin.controller;

import com.revworkforce.admin.dto.response.DashboardResponse;
import com.revworkforce.admin.service.DashboardService;
import com.revworkforce.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Admin Dashboard", description = "HR metrics and dashboard data")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Get admin dashboard with key HR metrics")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        DashboardResponse dashboard = dashboardService.getDashboard();
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }
}
