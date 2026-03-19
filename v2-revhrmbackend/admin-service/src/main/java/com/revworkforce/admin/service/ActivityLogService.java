package com.revworkforce.admin.service;

import com.revworkforce.admin.entity.ActivityLog;
import com.revworkforce.common.dto.PageResponse;

public interface ActivityLogService {
    ActivityLog log(Long userId, String action, String entityType, Long entityId, String description);
    PageResponse<ActivityLog> getAllLogs(int page, int size);
    PageResponse<ActivityLog> getLogsByUser(Long userId, int page, int size);
    PageResponse<ActivityLog> getLogsByEntityType(String entityType, int page, int size);
}
