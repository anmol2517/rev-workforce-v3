package com.revworkforce.admin.repository;

import com.revworkforce.admin.entity.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    Page<Announcement> findByActive(boolean active, Pageable pageable);
    List<Announcement> findByActiveOrderByCreatedAtDesc(boolean active);
    long countByActive(boolean active);
}
