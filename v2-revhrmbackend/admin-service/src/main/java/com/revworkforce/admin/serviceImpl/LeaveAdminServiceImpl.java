package com.revworkforce.admin.serviceImpl;

import com.revworkforce.admin.client.LeaveClient;
import com.revworkforce.admin.dto.request.LeaveBalanceAdjustRequest;
import com.revworkforce.admin.dto.request.LeaveQuotaRequest;
import com.revworkforce.admin.service.ActivityLogService;
import com.revworkforce.admin.service.LeaveAdminService;
import com.revworkforce.common.dto.LeaveBalanceDTO;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.common.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveAdminServiceImpl implements LeaveAdminService {

    private final LeaveClient leaveClient;
    private final ActivityLogService activityLogService;

    @Override
    public LeaveBalanceDTO assignLeaveQuota(LeaveQuotaRequest request, Long adminUserId) {
        var response = leaveClient.assignLeaveQuota(request);
        if (response == null || !response.isSuccess()) {
            throw new BadRequestException("Failed to assign leave quota");
        }
        activityLogService.log(adminUserId, "ASSIGN_LEAVE_QUOTA", "LEAVE_BALANCE",
                request.getEmployeeId(),
                "Assigned " + request.getTotalDays() + " days of " + request.getLeaveType()
                        + " to employee " + request.getEmployeeId());
        log.info("Leave quota assigned for employee: {}", request.getEmployeeId());
        return response.getData();
    }

    @Override
    public LeaveBalanceDTO adjustLeaveBalance(LeaveBalanceAdjustRequest request, Long adminUserId) {
        var response = leaveClient.adjustLeaveBalance(request);
        if (response == null || !response.isSuccess()) {
            throw new BadRequestException("Failed to adjust leave balance");
        }
        activityLogService.log(adminUserId, "ADJUST_LEAVE_BALANCE", "LEAVE_BALANCE",
                request.getEmployeeId(),
                "Adjusted leave balance for employee " + request.getEmployeeId()
                        + " - Reason: " + request.getReason());
        log.info("Leave balance adjusted for employee: {}", request.getEmployeeId());
        return response.getData();
    }

    @Override
    public List<LeaveBalanceDTO> getLeaveBalanceByEmployee(Long employeeId) {
        var response = leaveClient.getLeaveBalanceByEmployee(employeeId);
        if (response == null || !response.isSuccess()) {
            throw new BadRequestException("Failed to fetch leave balances");
        }
        return response.getData();
    }

    @Override
    public PageResponse<Object> getAllLeaves(int page, int size, String status,
            Long employeeId, Long departmentId) {
        var response = leaveClient.getAllLeaves(page, size, status, employeeId, departmentId);
        if (response == null || !response.isSuccess()) {
            throw new BadRequestException("Failed to fetch leaves");
        }
        return response.getData();
    }

    @Override
    public Object getLeaveReport(String type, Integer year, Long departmentId) {
        var response = leaveClient.getLeaveReport(type, year, departmentId);
        if (response == null || !response.isSuccess()) {
            throw new BadRequestException("Failed to generate leave report");
        }
        return response.getData();
    }
}
