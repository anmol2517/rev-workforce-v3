package com.revworkforce.admin.dto.response;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveReportResponse {

    private String reportType;
    private int year;
    private List<LeaveReportEntry> entries;
    private long totalLeavesTaken;
    private long totalPendingLeaves;
    private long totalApprovedLeaves;
    private long totalRejectedLeaves;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LeaveReportEntry {
        private String identifier;
        private String name;
        private long casualLeaveUsed;
        private long sickLeaveUsed;
        private long paidLeaveUsed;
        private long totalUsed;
        private long pending;
    }
}
