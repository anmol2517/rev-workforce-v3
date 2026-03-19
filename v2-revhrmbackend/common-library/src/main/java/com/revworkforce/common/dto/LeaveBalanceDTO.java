package com.revworkforce.common.dto;

import com.revworkforce.common.enums.LeaveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalanceDTO {
    private Long balanceId;
    private Long employeeId;
    private LeaveType leaveType;
    private int totalDays;
    private int usedDays;
    private int remainingDays;
    private int year;
}
