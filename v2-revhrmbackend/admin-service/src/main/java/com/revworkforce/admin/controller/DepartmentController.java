package com.revworkforce.admin.controller;

import com.revworkforce.admin.dto.request.DepartmentRequest;
import com.revworkforce.admin.dto.response.BulkDepartmentResponse;
import com.revworkforce.admin.entity.Department;
import com.revworkforce.admin.security.RequestContext;
import com.revworkforce.admin.service.DepartmentService;
import com.revworkforce.common.dto.ApiResponse;
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
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
@Tag(name = "Department Management", description = "CRUD operations for departments")
public class DepartmentController {

    private final DepartmentService departmentService;
    private final RequestContext requestContext;

    @PostMapping
    @Operation(summary = "Create a new department")
    public ResponseEntity<ApiResponse<Department>> createDepartment(
            @Valid @RequestBody DepartmentRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        Department department = departmentService.createDepartment(request, adminUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(department, "Department created successfully"));
    }

    @GetMapping
    @Operation(summary = "Get all departments")
    public ResponseEntity<ApiResponse<PageResponse<Department>>> getAllDepartments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        PageResponse<Department> response = departmentService.getAllDepartments(page, size, activeOnly);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{departmentId}")
    @Operation(summary = "Get department by ID")
    public ResponseEntity<ApiResponse<Department>> getDepartmentById(@PathVariable Long departmentId) {
        Department department = departmentService.getDepartmentById(departmentId);
        return ResponseEntity.ok(ApiResponse.success(department));
    }

    @PutMapping("/{departmentId}")
    @Operation(summary = "Update department")
    public ResponseEntity<ApiResponse<Department>> updateDepartment(
            @PathVariable Long departmentId,
            @Valid @RequestBody DepartmentRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        Department department = departmentService.updateDepartment(departmentId, request, adminUserId);
        return ResponseEntity.ok(ApiResponse.success(department, "Department updated successfully"));
    }

    @DeleteMapping("/{departmentId}")
    @Operation(summary = "Delete (deactivate) department")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long departmentId) {
        Long adminUserId = requestContext.getCurrentUserId();
        departmentService.deleteDepartment(departmentId, adminUserId);
        return ResponseEntity.ok(ApiResponse.success("Department deleted successfully"));
    }

    @PostMapping("/bulk")
    @Operation(summary = "Create multiple departments — duplicates are skipped automatically")
    public ResponseEntity<ApiResponse<BulkDepartmentResponse>> createDepartmentsBulk(
            @Valid @RequestBody List<DepartmentRequest> requests) {
        Long adminUserId = requestContext.getCurrentUserId();
        BulkDepartmentResponse response = departmentService.createDepartmentsBulk(requests, adminUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, response.getTotalCreated() + " created, " + response.getTotalSkipped() + " skipped"));
    }
}