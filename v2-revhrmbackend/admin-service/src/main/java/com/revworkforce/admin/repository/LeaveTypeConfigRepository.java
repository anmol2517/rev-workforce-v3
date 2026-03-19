package com.revworkforce.admin.repository;

import com.revworkforce.admin.entity.LeaveTypeConfig;
import com.revworkforce.common.enums.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveTypeConfigRepository extends JpaRepository<LeaveTypeConfig, Long> {
    Optional<LeaveTypeConfig> findByLeaveType(LeaveType leaveType);
    List<LeaveTypeConfig> findByActive(boolean active);
    boolean existsByLeaveType(LeaveType leaveType);
}
