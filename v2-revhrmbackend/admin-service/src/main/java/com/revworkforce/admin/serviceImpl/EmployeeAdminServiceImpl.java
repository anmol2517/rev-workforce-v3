package com.revworkforce.admin.serviceImpl;

import com.revworkforce.admin.client.AuthClient;
import com.revworkforce.admin.client.EmployeeClient;
import com.revworkforce.admin.client.LeaveClient;
import com.revworkforce.admin.dto.request.AssignManagerRequest;
import com.revworkforce.admin.dto.request.CreateEmployeeRequest;
import com.revworkforce.admin.dto.request.InternalAuthRegisterRequest;
import com.revworkforce.admin.dto.request.PasswordResetRequest;
import com.revworkforce.admin.dto.request.UpdateEmployeeRequest;
import com.revworkforce.admin.service.ActivityLogService;
import com.revworkforce.admin.service.EmployeeAdminService;
import com.revworkforce.admin.service.LeaveTypeConfigService;
import com.revworkforce.common.dto.EmployeeDTO;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.common.enums.Role;
import com.revworkforce.common.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeAdminServiceImpl implements EmployeeAdminService {

    private final EmployeeClient employeeClient;
    private final AuthClient authClient;
    private final ActivityLogService activityLogService;
    private final LeaveClient leaveClient;
    private final LeaveTypeConfigService leaveTypeConfigService;

    @Override
    public EmployeeDTO createEmployee(CreateEmployeeRequest request, Long adminUserId) {
        if (request.getRole() == Role.MANAGER) {
            request.setManagerId(null);
            request.setManagerName(null);
        } else if (request.getRole() == Role.EMPLOYEE && request.getManagerId() == null) {
            Long assignedMgrId = autoAssignManager(request.getDepartmentId());
            request.setManagerId(assignedMgrId);
            if (assignedMgrId != null) {
                try {
                    var mgr = employeeClient.getEmployeeById(assignedMgrId);
                    if (mgr != null && mgr.isSuccess() && mgr.getData() != null) {
                        request.setManagerName(mgr.getData().getFirstName() + " " + mgr.getData().getLastName());
                    }
                } catch (Exception e) {
                    log.warn("Could not resolve manager name: {}", e.getMessage());
                }
            }
        }

        // STEP 1: Register auth user FIRST → get userId back
        // This ensures employee PK == auth userId for all downstream identity lookups
        Long authUserId;
        try {
            InternalAuthRegisterRequest authRequest = InternalAuthRegisterRequest.builder()
                    .email(request.getEmail())
                    .password(request.getPassword())
                    .role(request.getRole())
                    .build();
            var authResponse = authClient.registerUser(authRequest);
            if (authResponse == null || !authResponse.isSuccess() || authResponse.getData() == null) {
                throw new BadRequestException("Failed to create login credentials for employee.");
            }
            @SuppressWarnings("unchecked")
            Map<String, Object> userData = (Map<String, Object>) authResponse.getData();
            authUserId = Long.valueOf(userData.get("userId").toString());
            log.info("Auth user created: userId={}, email={}", authUserId, request.getEmail());
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Auth registration failed for {}: {}", request.getEmail(), e.getMessage());
            throw new BadRequestException("Auth registration failed: " + e.getMessage());
        }

        // STEP 2: Create employee record with authUserId as PK
        request.setUserId(authUserId);
        EmployeeDTO created;
        try {
            var empResponse = employeeClient.createEmployee(request);
            if (empResponse == null || !empResponse.isSuccess()) {
                authClient.deactivateUser(authUserId);
                throw new BadRequestException("Failed to create employee record. Auth user deactivated.");
            }
            created = empResponse.getData();
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            authClient.deactivateUser(authUserId);
            throw new BadRequestException("Employee creation failed: " + e.getMessage());
        }

        // STEP 3: Sync empCode back to auth-service
        try {
            authClient.updateEmployeeCode(authUserId, Map.of("employeeCode", created.getEmpCode()));
        } catch (Exception e) {
            log.warn("Could not sync empCode to auth for userId {}: {}", authUserId, e.getMessage());
        }

        try {
            int currentYear = java.time.LocalDate.now().getYear();
            var leaveTypes = leaveTypeConfigService.getAllLeaveTypes();
            for (var lt : leaveTypes) {
                if (lt.isActive()) {
                    leaveClient.assignLeaveQuota(Map.of(
                            "employeeId", created.getEmployeeId(),
                            "leaveType", lt.getLeaveType().name(),
                            "totalDays", lt.getDefaultQuota(),
                            "year", currentYear
                    ));
                }
            }
            log.info("Leave quota auto-assigned for: {}", created.getEmployeeId());
        } catch (Exception e) {
            log.warn("Could not auto-assign leave quota: {}", e.getMessage());
        }

        activityLogService.log(adminUserId, "CREATE", "EMPLOYEE", created.getEmployeeId(),
                "Created employee: " + created.getFirstName() + " " + created.getLastName());
        return created;
    }

    private Long autoAssignManager(Long departmentId) {
        if (departmentId == null) return null;
        try {
            var response = employeeClient.getManagersByDepartment(departmentId);
            if (response != null && response.isSuccess() && response.getData() != null) {
                List<EmployeeDTO> managers = response.getData();
                if (managers.size() == 1) return managers.get(0).getEmployeeId();
            }
        } catch (Exception e) {
            log.warn("Auto-assign manager failed for dept {}: {}", departmentId, e.getMessage());
        }
        return null;
    }

    @Override
    public EmployeeDTO updateEmployee(Long employeeId, UpdateEmployeeRequest request, Long adminUserId) {
        var empResponse = employeeClient.updateEmployee(employeeId, request);
        if (empResponse == null || !empResponse.isSuccess()) throw new BadRequestException("Failed to update employee");
        activityLogService.log(adminUserId, "UPDATE", "EMPLOYEE", employeeId, "Updated employee: " + employeeId);
        return empResponse.getData();
    }

    @Override
    public EmployeeDTO getEmployeeById(Long employeeId) {
        var response = employeeClient.getEmployeeById(employeeId);
        if (response == null || !response.isSuccess()) throw new BadRequestException("Employee not found: " + employeeId);
        return response.getData();
    }

    @Override
    public PageResponse<EmployeeDTO> getAllEmployees(int page, int size, String search, Long departmentId, String status) {
        var response = employeeClient.getAllEmployees(page, size, search, departmentId, status);
        if (response == null || !response.isSuccess()) throw new BadRequestException("Failed to fetch employees");
        return response.getData();
    }

    @Override
    public void deactivateEmployee(Long employeeId, Long adminUserId) {
        employeeClient.deactivateEmployee(employeeId);
        authClient.deactivateUser(employeeId);
        activityLogService.log(adminUserId, "DEACTIVATE", "EMPLOYEE", employeeId, "Deactivated: " + employeeId);
    }

    @Override
    public void activateEmployee(Long employeeId, Long adminUserId) {
        employeeClient.activateEmployee(employeeId);
        authClient.activateUser(employeeId);
        activityLogService.log(adminUserId, "ACTIVATE", "EMPLOYEE", employeeId, "Activated: " + employeeId);
    }

    @Override
    public EmployeeDTO assignManager(Long employeeId, AssignManagerRequest request, Long adminUserId) {
        var response = employeeClient.assignManager(employeeId, request);
        if (response == null || !response.isSuccess()) throw new BadRequestException("Failed to assign manager");
        activityLogService.log(adminUserId, "ASSIGN_MANAGER", "EMPLOYEE", employeeId,
                "Assigned manager " + request.getManagerId() + " to " + employeeId);
        return response.getData();
    }

    @Override
    public void resetEmployeePassword(Long employeeId, PasswordResetRequest request, Long adminUserId) {
        authClient.resetPassword(employeeId, request);
        activityLogService.log(adminUserId, "RESET_PASSWORD", "EMPLOYEE", employeeId, "Password reset for: " + employeeId);
    }

    @Override
    public List<EmployeeDTO> createEmployeesBulk(List<CreateEmployeeRequest> requests, Long adminUserId) {
        List<EmployeeDTO> created = new ArrayList<>();
        for (CreateEmployeeRequest req : requests) {
            try { created.add(createEmployee(req, adminUserId)); }
            catch (Exception e) { log.warn("Bulk create failed for {}: {}", req.getEmail(), e.getMessage()); }
        }
        return created;
    }

    @Override
    public List<EmployeeDTO> getManagersByDepartment(Long departmentId) {
        var response = employeeClient.getManagersByDepartment(departmentId);
        return (response != null && response.isSuccess() && response.getData() != null)
                ? response.getData() : List.of();
    }
}
