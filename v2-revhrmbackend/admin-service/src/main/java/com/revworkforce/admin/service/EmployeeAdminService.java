package com.revworkforce.admin.service;

import com.revworkforce.admin.dto.request.*;
import com.revworkforce.common.dto.EmployeeDTO;
import com.revworkforce.common.dto.PageResponse;

import java.util.List;

public interface EmployeeAdminService {
    EmployeeDTO createEmployee(CreateEmployeeRequest request, Long adminUserId);
    EmployeeDTO updateEmployee(Long employeeId, UpdateEmployeeRequest request, Long adminUserId);
    EmployeeDTO getEmployeeById(Long employeeId);
    PageResponse<EmployeeDTO> getAllEmployees(int page, int size, String search, Long departmentId, String status);
    void deactivateEmployee(Long employeeId, Long adminUserId);
    void activateEmployee(Long employeeId, Long adminUserId);
    EmployeeDTO assignManager(Long employeeId, AssignManagerRequest request, Long adminUserId);
    void resetEmployeePassword(Long employeeId, PasswordResetRequest request, Long adminUserId);
    List<EmployeeDTO> getManagersByDepartment(Long departmentId);
    List<EmployeeDTO> createEmployeesBulk(List<CreateEmployeeRequest> requests, Long adminUserId);
}
