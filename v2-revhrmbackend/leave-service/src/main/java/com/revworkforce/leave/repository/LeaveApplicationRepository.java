package com.revworkforce.leave.repository;

import com.revworkforce.common.enums.LeaveStatus;
import com.revworkforce.common.enums.LeaveType;
import com.revworkforce.leave.entity.LeaveApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, Long> {

    Page<LeaveApplication> findByEmployeeId(Long employeeId, Pageable pageable);
    Page<LeaveApplication> findByManagerId(Long managerId, Pageable pageable);
    List<LeaveApplication> findByManagerIdAndStatus(Long managerId, LeaveStatus status);
    long countByStatus(LeaveStatus status);
    List<LeaveApplication> findByEmployeeIdAndStatus(Long employeeId, LeaveStatus status);

    @Query("SELECT l FROM LeaveApplication l WHERE " +
           "(:status IS NULL OR l.status = :status) " +
           "AND (:employeeId IS NULL OR l.employeeId = :employeeId)")
    Page<LeaveApplication> findAllFiltered(
            @Param("status") LeaveStatus status,
            @Param("employeeId") Long employeeId,
            Pageable pageable);

    @Query("SELECT COUNT(l) FROM LeaveApplication l WHERE l.status = 'APPROVED' " +
           "AND l.reviewedAt >= :startOfDay AND l.reviewedAt < :endOfDay")
    long countApprovedToday(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);

    List<LeaveApplication> findByManagerIdAndStartDateBetween(
            Long managerId, LocalDate from, LocalDate to);

    @Query("SELECT l.leaveType, COUNT(l) FROM LeaveApplication l " +
           "WHERE l.status = 'APPROVED' GROUP BY l.leaveType")
    List<Object[]> countByLeaveTypeGrouped();

    @Query("SELECT l FROM LeaveApplication l WHERE l.employeeId = :employeeId " +
           "AND l.status = 'APPROVED' " +
           "AND ((l.startDate <= :endDate) AND (l.endDate >= :startDate))")
    List<LeaveApplication> findOverlapping(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
