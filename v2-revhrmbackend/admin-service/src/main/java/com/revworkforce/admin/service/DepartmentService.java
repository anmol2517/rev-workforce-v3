package com.revworkforce.admin.service;

import com.revworkforce.admin.dto.request.DepartmentRequest;
import com.revworkforce.admin.dto.response.BulkDepartmentResponse;
import com.revworkforce.admin.entity.Department;
import com.revworkforce.common.dto.PageResponse;

import java.util.List;

public interface DepartmentService {
    Department createDepartment(DepartmentRequest request, Long adminUserId);
    Department updateDepartment(Long departmentId, DepartmentRequest request, Long adminUserId);
    void deleteDepartment(Long departmentId, Long adminUserId);
    Department getDepartmentById(Long departmentId);
    PageResponse<Department> getAllDepartments(int page, int size, boolean activeOnly);
    BulkDepartmentResponse createDepartmentsBulk(List<DepartmentRequest> requests, Long adminUserId);
}