package com.revworkforce.admin.serviceImpl;

import com.revworkforce.admin.client.EmployeeClient;
import com.revworkforce.admin.client.LeaveClient;
import com.revworkforce.admin.client.PerformanceClient;
import com.revworkforce.admin.dto.response.DashboardResponse;
import com.revworkforce.admin.repository.AnnouncementRepository;
import com.revworkforce.admin.repository.DepartmentRepository;
import com.revworkforce.admin.repository.DesignationRepository;
import com.revworkforce.admin.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeClient employeeClient;
    private final LeaveClient leaveClient;
    private final PerformanceClient performanceClient;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final AnnouncementRepository announcementRepository;

    @Override
    public DashboardResponse getDashboard() {
        long totalEmployees = safeCount(() -> employeeClient.countEmployees(null).getData(), 0L);
        long activeEmployees = safeCount(() -> employeeClient.countEmployees("ACTIVE").getData(), 0L);
        long inactiveEmployees = safeCount(() -> employeeClient.countEmployees("INACTIVE").getData(), 0L);
        long totalManagers = safeCount(() -> employeeClient.countEmployees("MANAGER").getData(), 0L);
        long pendingLeaves = safeCount(() -> leaveClient.countPendingLeaves().getData(), 0L);
        long approvedLeaves = safeCount(() -> leaveClient.countLeavesByStatus("APPROVED").getData(), 0L);
        long rejectedLeaves = safeCount(() -> leaveClient.countLeavesByStatus("REJECTED").getData(), 0L);
        long approvedToday = safeCount(() -> leaveClient.countApprovedLeavesToday().getData(), 0L);
        long totalDepartments = departmentRepository.countByActive(true);
        long totalDesignations = designationRepository.countByActive(true);
        long activeAnnouncements = announcementRepository.countByActive(true);
        long totalGoals = safeCount(() -> performanceClient.countTotalGoals().getData(), 0L);

        return DashboardResponse.builder()
                .totalEmployees(totalEmployees)
                .activeEmployees(activeEmployees)
                .inactiveEmployees(inactiveEmployees)
                .totalManagers(totalManagers)
                .totalDepartments(totalDepartments)
                .totalDesignations(totalDesignations)
                .pendingLeaveRequests(pendingLeaves)
                .approvedLeaves(approvedLeaves)
                .rejectedLeaves(rejectedLeaves)
                .approvedLeavesToday(approvedToday)
                .totalAnnouncementsActive(activeAnnouncements)
                .totalGoals(totalGoals)
                .build();
    }

    private <T> T safeCount(java.util.function.Supplier<T> supplier, T defaultValue) {
        try {
            T value = supplier.get();
            return value != null ? value : defaultValue;
        } catch (Exception e) {
            log.warn("Dashboard metric fetch failed: {}", e.getMessage());
            return defaultValue;
        }
    }
}
