package com.revworkforce.admin.serviceImpl;

import com.revworkforce.admin.client.EmployeeClient;
import com.revworkforce.admin.client.PerformanceClient;
import com.revworkforce.admin.dto.request.AdminProfileUpdateRequest;
import com.revworkforce.admin.service.ActivityLogService;
import com.revworkforce.admin.service.AdminProfileService;
import com.revworkforce.common.dto.EmployeeDTO;
import com.revworkforce.common.dto.EmployeeReportDTO;
import com.revworkforce.common.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminProfileServiceImpl implements AdminProfileService {

    private final EmployeeClient employeeClient;
    private final PerformanceClient performanceClient;
    private final ActivityLogService activityLogService;

    @Override
    public EmployeeDTO getAdminProfile(Long userId) {
        var response = employeeClient.getEmployeeByUserId(userId);
        if (response == null || !response.isSuccess()) {
            throw new BadRequestException("Admin profile not found");
        }
        return response.getData();
    }

    @Override
    public EmployeeDTO updateAdminProfile(Long userId, AdminProfileUpdateRequest request) {
        Map<String, Object> updates = new HashMap<>();
        if (request.getFirstName() != null) updates.put("firstName", request.getFirstName());
        if (request.getLastName() != null) updates.put("lastName", request.getLastName());
        if (request.getPhone() != null) updates.put("phone", request.getPhone());
        if (request.getAddress() != null) updates.put("address", request.getAddress());
        if (request.getEmergencyContact() != null) updates.put("emergencyContact", request.getEmergencyContact());
        if (request.getEmergencyContactName() != null) updates.put("emergencyContactName", request.getEmergencyContactName());

        EmployeeDTO profile = getAdminProfile(userId);
        var response = employeeClient.updateEmployee(profile.getEmployeeId(), updates);
        if (response == null || !response.isSuccess()) {
            throw new BadRequestException("Failed to update admin profile");
        }
        activityLogService.log(userId, "UPDATE_PROFILE", "ADMIN", profile.getEmployeeId(),
                "Admin profile updated");
        return response.getData();
    }

    @Override
    public EmployeeReportDTO getAdminReport(Long userId) {
        EmployeeDTO profile = getAdminProfile(userId);
        Long totalGoals = safeGet(() -> performanceClient.countTotalGoals().getData(), 0L);

        return EmployeeReportDTO.builder()
                .empCode(profile.getEmpCode())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .email(profile.getEmail())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .departmentName(profile.getDepartmentName())
                .designationName(profile.getDesignationName())
                .role(profile.getRole() != null ? profile.getRole().name() : "ADMIN")
                .status(profile.getStatus() != null ? profile.getStatus().name() : "ACTIVE")
                .joiningDate(profile.getJoiningDate())
                .salary(profile.getSalary())
                .totalGoalsAssigned(totalGoals.intValue())
                .build();
    }

    private <T> T safeGet(java.util.function.Supplier<T> supplier, T defaultValue) {
        try {
            T val = supplier.get();
            return val != null ? val : defaultValue;
        } catch (Exception e) {
            log.warn("Failed to fetch metric: {}", e.getMessage());
            return defaultValue;
        }
    }
}
