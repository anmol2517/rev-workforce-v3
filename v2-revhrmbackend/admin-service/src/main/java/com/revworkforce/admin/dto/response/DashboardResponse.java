package com.revworkforce.admin.dto.response;

import lombok.*;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;
    private long totalDepartments;
    private long totalDesignations;
    private long totalManagers;
    private long pendingLeaveRequests;
    private long approvedLeaves;
    private long rejectedLeaves;
    private long approvedLeavesToday;
    private long totalAnnouncementsActive;
    private long totalGoals;
    private Map<String, Long> employeesByDepartment;
    private Map<String, Long> leavesByType;
}
