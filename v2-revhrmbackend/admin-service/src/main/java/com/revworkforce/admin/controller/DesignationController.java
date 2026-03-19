package com.revworkforce.admin.controller;

import com.revworkforce.admin.dto.request.DesignationRequest;
import com.revworkforce.admin.entity.Designation;
import com.revworkforce.admin.security.RequestContext;
import com.revworkforce.admin.service.DesignationService;
import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.common.enums.DesignationLevel;
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
@RequestMapping("/api/admin/designations")
@RequiredArgsConstructor
@Tag(name = "Designation Management", description = "CRUD operations for designations/job titles")
public class DesignationController {

    private final DesignationService designationService;
    private final RequestContext requestContext;

    @PostMapping
    @Operation(summary = "Create designation with level (SENIOR/JUNIOR)")
    public ResponseEntity<ApiResponse<Designation>> createDesignation(
            @Valid @RequestBody DesignationRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        designationService.createDesignation(request, adminUserId),
                        "Designation created successfully"));
    }

    @PostMapping("/bulk")
    @Operation(summary = "Create multiple designations")
    public ResponseEntity<ApiResponse<List<Designation>>> createDesignationsBulk(
            @Valid @RequestBody List<DesignationRequest> requests) {
        Long adminUserId = requestContext.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        designationService.createDesignationsBulk(requests, adminUserId),
                        "Designations created"));
    }

    @GetMapping
    @Operation(summary = "Get all designations")
    public ResponseEntity<ApiResponse<PageResponse<Designation>>> getAllDesignations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        return ResponseEntity.ok(ApiResponse.success(
                designationService.getAllDesignations(page, size, activeOnly)));
    }

    @GetMapping("/filter")
    @Operation(summary = "Get designations by level — SENIOR for manager role, JUNIOR for employee role")
    public ResponseEntity<ApiResponse<List<Designation>>> getDesignationsByLevel(
            @RequestParam(defaultValue = "ANY") DesignationLevel level) {
        return ResponseEntity.ok(ApiResponse.success(
                designationService.getDesignationsByLevel(level)));
    }

    @GetMapping("/{designationId}")
    @Operation(summary = "Get designation by ID")
    public ResponseEntity<ApiResponse<Designation>> getDesignationById(
            @PathVariable Long designationId) {
        return ResponseEntity.ok(ApiResponse.success(
                designationService.getDesignationById(designationId)));
    }

    @PutMapping("/{designationId}")
    @Operation(summary = "Update designation")
    public ResponseEntity<ApiResponse<Designation>> updateDesignation(
            @PathVariable Long designationId,
            @Valid @RequestBody DesignationRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                designationService.updateDesignation(designationId, request, adminUserId),
                "Designation updated successfully"));
    }

    @DeleteMapping("/{designationId}")
    @Operation(summary = "Delete designation")
    public ResponseEntity<ApiResponse<Void>> deleteDesignation(@PathVariable Long designationId) {
        Long adminUserId = requestContext.getCurrentUserId();
        designationService.deleteDesignation(designationId, adminUserId);
        return ResponseEntity.ok(ApiResponse.success("Designation deleted successfully"));
    }
}
