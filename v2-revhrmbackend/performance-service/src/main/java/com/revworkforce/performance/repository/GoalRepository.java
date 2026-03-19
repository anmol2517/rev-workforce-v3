package com.revworkforce.performance.repository;

import com.revworkforce.common.enums.GoalStatus;
import com.revworkforce.performance.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByEmployeeId(Long employeeId);
    List<Goal> findByEmployeeIdAndYear(Long employeeId, int year);
    List<Goal> findByManagerId(Long managerId);
    List<Goal> findByManagerIdAndAssignedByManager(Long managerId, boolean assignedByManager);
    List<Goal> findByEmployeeIdAndAssignedByManager(Long employeeId, boolean assignedByManager);

    // FIX: Manager-employee relation check ke liye
    List<Goal> findByEmployeeIdAndManagerId(Long employeeId, Long managerId);
    boolean existsByEmployeeIdAndManagerId(Long employeeId, Long managerId);

    long countByStatus(GoalStatus status);
    long countByManagerId(Long managerId);

    @Query("SELECT COUNT(g) FROM Goal g WHERE g.managerId = :managerId AND g.assignedByManager = true")
    long countAssignedByManager(@Param("managerId") Long managerId);

    @Query("SELECT g.status, COUNT(g) FROM Goal g GROUP BY g.status")
    List<Object[]> countByStatusGrouped();

    @Query("SELECT COUNT(g) FROM Goal g WHERE g.employeeId = :employeeId AND g.status = :status")
    long countByEmployeeIdAndStatus(@Param("employeeId") Long employeeId, @Param("status") GoalStatus status);

    @Query("SELECT g FROM Goal g WHERE g.managerId = :managerId AND g.status NOT IN ('COMPLETED')")
    List<Goal> findActiveGoalsByManager(@Param("managerId") Long managerId);
}