package com.revworkforce.admin.controller;

import com.revworkforce.admin.dto.request.AdminProfileUpdateRequest;
import com.revworkforce.admin.security.RequestContext;
import com.revworkforce.admin.service.AdminProfileService;
import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.EmployeeDTO;
import com.revworkforce.common.dto.EmployeeReportDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
@Tag(name = "Admin Profile", description = "Admin own profile management")
public class AdminProfileController {

    private final AdminProfileService adminProfileService;
    private final RequestContext requestContext;

    @GetMapping
    @Operation(summary = "Get admin own profile")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getAdminProfile() {
        Long userId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                adminProfileService.getAdminProfile(userId)));
    }

    @PutMapping
    @Operation(summary = "Update admin profile (firstName, lastName, phone, address only)")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateAdminProfile(
            @Valid @RequestBody AdminProfileUpdateRequest request) {
        Long userId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                adminProfileService.updateAdminProfile(userId, request),
                "Profile updated successfully"));
    }

    @GetMapping("/report")
    @Operation(summary = "Download admin profile report data")
    public ResponseEntity<ApiResponse<EmployeeReportDTO>> getAdminReport() {
        Long userId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                adminProfileService.getAdminReport(userId)));
    }
}
