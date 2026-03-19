package com.revworkforce.admin.serviceImpl;

import com.revworkforce.admin.entity.ActivityLog;
import com.revworkforce.admin.repository.ActivityLogRepository;
import com.revworkforce.admin.service.ActivityLogService;
import com.revworkforce.common.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    @Override
    public ActivityLog log(Long userId, String action, String entityType, Long entityId, String description) {
        ActivityLog activityLog = ActivityLog.builder()
                .userId(userId)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .build();
        return activityLogRepository.save(activityLog);
    }

    @Override
    public PageResponse<ActivityLog> getAllLogs(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<ActivityLog> logs = activityLogRepository.findAll(pageable);
        return PageResponse.of(logs);
    }

    @Override
    public PageResponse<ActivityLog> getLogsByUser(Long userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<ActivityLog> logs = activityLogRepository.findByUserId(userId, pageable);
        return PageResponse.of(logs);
    }

    @Override
    public PageResponse<ActivityLog> getLogsByEntityType(String entityType, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<ActivityLog> logs = activityLogRepository.findByEntityType(entityType, pageable);
        return PageResponse.of(logs);
    }
}
