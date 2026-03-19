package com.revworkforce.performance.repository;

import com.revworkforce.common.enums.ReviewStatus;
import com.revworkforce.performance.entity.PerformanceReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, Long> {
    List<PerformanceReview> findByEmployeeId(Long employeeId);
    List<PerformanceReview> findByManagerId(Long managerId);
    List<PerformanceReview> findByManagerIdAndStatus(Long managerId, ReviewStatus status);
    Optional<PerformanceReview> findByEmployeeIdAndReviewYear(Long employeeId, int year);
    long countByManagerIdAndStatus(Long managerId, ReviewStatus status);

    @Query("SELECT COUNT(r) FROM PerformanceReview r WHERE r.managerId = :managerId AND r.status = 'SUBMITTED'")
    long countPendingReviewsForManager(@Param("managerId") Long managerId);

    @Query("SELECT COUNT(r) FROM PerformanceReview r WHERE r.employeeId = :employeeId")
    long countByEmployee(@Param("employeeId") Long employeeId);
}
