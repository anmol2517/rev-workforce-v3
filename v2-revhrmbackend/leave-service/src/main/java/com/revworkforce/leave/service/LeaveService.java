package com.revworkforce.leave.service;

import com.revworkforce.common.dto.LeaveBalanceDTO;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.leave.dto.request.ApplyLeaveRequest;
import com.revworkforce.leave.dto.request.LeaveActionRequest;
import com.revworkforce.leave.entity.LeaveApplication;
import com.revworkforce.leave.entity.LeaveBalance;

import java.util.List;

public interface LeaveService {
    LeaveApplication applyLeave(Long employeeId, String employeeName, Long managerId, ApplyLeaveRequest request);
    LeaveApplication cancelLeave(Long leaveId, Long employeeId);
    LeaveApplication getLeaveById(Long leaveId);
    PageResponse<LeaveApplication> getMyLeaves(Long employeeId, int page, int size);
    PageResponse<LeaveApplication> getTeamLeaves(Long managerId, int page, int size);
    LeaveApplication approveLeave(Long leaveId, Long managerId, LeaveActionRequest request);
    LeaveApplication rejectLeave(Long leaveId, Long managerId, LeaveActionRequest request);
    List<LeaveBalance> getMyLeaveBalances(Long employeeId);
    List<LeaveBalance> getLeaveBalanceByEmployee(Long employeeId);
    LeaveBalance assignLeaveQuota(Long employeeId, String leaveType, int totalDays, int year);
    LeaveBalance adjustLeaveBalance(Long employeeId, String leaveType, int days, String reason, int year);
    PageResponse<LeaveApplication> getAllLeaves(int page, int size, String status, Long employeeId, Long departmentId);
    long countPendingLeaves();
    long countApprovedLeavesToday();
    long countLeavesByStatus(String status);
    Object getLeaveReport(String type, Integer year, Long departmentId);
    List<LeaveApplication> getTeamLeaveCalendar(Long managerId);
}
