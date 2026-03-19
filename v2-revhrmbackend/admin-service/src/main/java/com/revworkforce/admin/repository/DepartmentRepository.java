package com.revworkforce.admin.repository;

import com.revworkforce.admin.entity.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByNameIgnoreCase(String name);

    @Query("SELECT COUNT(d) > 0 FROM Department d WHERE LOWER(d.name) = LOWER(:name) AND d.name IS NOT NULL")
    boolean existsByNameIgnoreCase(@Param("name") String name);

    Page<Department> findByActive(boolean active, Pageable pageable);
    long countByActive(boolean active);
}