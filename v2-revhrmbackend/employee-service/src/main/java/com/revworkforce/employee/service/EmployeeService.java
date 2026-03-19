package com.revworkforce.employee.service;

import com.revworkforce.common.dto.EmployeeDTO;
import com.revworkforce.common.dto.EmployeeReportDTO;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.employee.dto.request.InternalCreateEmployeeRequest;
import com.revworkforce.employee.dto.request.UpdateProfileRequest;

import java.util.List;
import java.util.Map;

public interface EmployeeService {
    EmployeeDTO createEmployee(InternalCreateEmployeeRequest request);
    EmployeeDTO updateEmployee(Long employeeId, Object request);
    EmployeeDTO getEmployeeById(Long employeeId);
    EmployeeDTO getEmployeeByUserId(Long userId);
    EmployeeDTO getEmployeeByEmail(String email);
    EmployeeDTO getMyProfile(Long userId);
    EmployeeDTO updateMyProfile(Long userId, UpdateProfileRequest request);
    PageResponse<EmployeeDTO> getAllEmployees(int page, int size, String search, Long departmentId, String status);
    PageResponse<EmployeeDTO> getDirectory(int page, int size, String search);
    void deactivateEmployee(Long employeeId);
    void activateEmployee(Long employeeId);
    EmployeeDTO assignManager(Long employeeId, Long managerId);
    List<EmployeeDTO> getTeamByManager(Long managerId);
    List<EmployeeDTO> getDirectReportees(Long managerId);
    List<EmployeeDTO> getManagersByDepartment(Long departmentId);
    Long countEmployees(String status);
    Long countByDepartment(Long departmentId);
    Map<String, Long> getEmployeeStatsByDepartment();
    EmployeeReportDTO getEmployeeReport(Long userId);
}
