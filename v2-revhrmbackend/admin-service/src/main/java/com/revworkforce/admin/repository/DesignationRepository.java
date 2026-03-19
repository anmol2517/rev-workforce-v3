package com.revworkforce.admin.repository;

import com.revworkforce.admin.entity.Designation;
import com.revworkforce.common.enums.DesignationLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Long> {
    Optional<Designation> findByTitleIgnoreCase(String title);
    boolean existsByTitleIgnoreCase(String title);
    Page<Designation> findByActive(boolean active, Pageable pageable);
    long countByActive(boolean active);
    List<Designation> findByActiveAndLevel(boolean active, DesignationLevel level);
    List<Designation> findByActive(boolean active);
}
