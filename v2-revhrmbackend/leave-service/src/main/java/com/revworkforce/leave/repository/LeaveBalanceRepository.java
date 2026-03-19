package com.revworkforce.leave.repository;

import com.revworkforce.common.enums.LeaveType;
import com.revworkforce.leave.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    List<LeaveBalance> findByEmployeeId(Long employeeId);
    List<LeaveBalance> findByEmployeeIdAndYear(Long employeeId, int year);
    Optional<LeaveBalance> findByEmployeeIdAndLeaveTypeAndYear(Long employeeId, LeaveType leaveType, int year);
}
