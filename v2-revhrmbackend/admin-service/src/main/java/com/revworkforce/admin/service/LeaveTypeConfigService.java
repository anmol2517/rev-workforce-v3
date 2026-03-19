package com.revworkforce.admin.service;

import com.revworkforce.admin.dto.request.LeaveTypeConfigRequest;
import com.revworkforce.admin.entity.LeaveTypeConfig;

import java.util.List;

public interface LeaveTypeConfigService {
    LeaveTypeConfig createOrUpdateLeaveType(LeaveTypeConfigRequest request, Long adminUserId);
    List<LeaveTypeConfig> getAllLeaveTypes();
    List<LeaveTypeConfig> getActiveLeaveTypes();
    LeaveTypeConfig updateLeaveType(Long id, LeaveTypeConfigRequest request, Long adminUserId);
}
