package com.revworkforce.admin.serviceImpl;

import com.revworkforce.admin.dto.request.LeaveTypeConfigRequest;
import com.revworkforce.admin.entity.LeaveTypeConfig;
import com.revworkforce.admin.repository.LeaveTypeConfigRepository;
import com.revworkforce.admin.service.ActivityLogService;
import com.revworkforce.admin.service.LeaveTypeConfigService;
import com.revworkforce.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveTypeConfigServiceImpl implements LeaveTypeConfigService {

    private final LeaveTypeConfigRepository leaveTypeConfigRepository;
    private final ActivityLogService activityLogService;

    @Override
    @Transactional
    public LeaveTypeConfig createOrUpdateLeaveType(LeaveTypeConfigRequest request, Long adminUserId) {
        LeaveTypeConfig config = leaveTypeConfigRepository
                .findByLeaveType(request.getLeaveType())
                .orElse(LeaveTypeConfig.builder()
                        .leaveType(request.getLeaveType())
                        .build());
        config.setDescription(request.getDescription());
        config.setDefaultQuota(request.getDefaultQuota());
        config.setActive(request.isActive());
        LeaveTypeConfig saved = leaveTypeConfigRepository.save(config);
        activityLogService.log(adminUserId, "CONFIGURE_LEAVE_TYPE", "LEAVE_TYPE_CONFIG",
                saved.getId(), "Configured leave type: " + saved.getLeaveType());
        return saved;
    }

    @Override
    public List<LeaveTypeConfig> getAllLeaveTypes() {
        return leaveTypeConfigRepository.findAll();
    }

    @Override
    public List<LeaveTypeConfig> getActiveLeaveTypes() {
        return leaveTypeConfigRepository.findByActive(true);
    }

    @Override
    @Transactional
    public LeaveTypeConfig updateLeaveType(Long id, LeaveTypeConfigRequest request, Long adminUserId) {
        LeaveTypeConfig config = leaveTypeConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveTypeConfig", "id", id));
        config.setDescription(request.getDescription());
        config.setDefaultQuota(request.getDefaultQuota());
        config.setActive(request.isActive());
        return leaveTypeConfigRepository.save(config);
    }
}
