package com.revworkforce.admin.service;

import com.revworkforce.admin.dto.request.LeaveBalanceAdjustRequest;
import com.revworkforce.admin.dto.request.LeaveQuotaRequest;
import com.revworkforce.common.dto.LeaveBalanceDTO;
import com.revworkforce.common.dto.PageResponse;

import java.util.List;

public interface LeaveAdminService {
    LeaveBalanceDTO assignLeaveQuota(LeaveQuotaRequest request, Long adminUserId);
    LeaveBalanceDTO adjustLeaveBalance(LeaveBalanceAdjustRequest request, Long adminUserId);
    List<LeaveBalanceDTO> getLeaveBalanceByEmployee(Long employeeId);
    PageResponse<Object> getAllLeaves(int page, int size, String status, Long employeeId, Long departmentId);
    Object getLeaveReport(String type, Integer year, Long departmentId);
}
