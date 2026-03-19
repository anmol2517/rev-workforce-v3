package com.revworkforce.admin.service;

import com.revworkforce.admin.dto.request.AdminProfileUpdateRequest;
import com.revworkforce.common.dto.EmployeeDTO;
import com.revworkforce.common.dto.EmployeeReportDTO;

public interface AdminProfileService {
    EmployeeDTO getAdminProfile(Long userId);
    EmployeeDTO updateAdminProfile(Long userId, AdminProfileUpdateRequest request);
    EmployeeReportDTO getAdminReport(Long userId);
}
