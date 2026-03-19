package com.revworkforce.admin.repository;

import com.revworkforce.admin.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    Page<ActivityLog> findByUserId(Long userId, Pageable pageable);
    Page<ActivityLog> findByEntityType(String entityType, Pageable pageable);
    List<ActivityLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime from, LocalDateTime to);
}
