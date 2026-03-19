package com.revworkforce.leave.serviceImpl;

import com.revworkforce.common.dto.NotificationRequest;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.common.enums.LeaveStatus;
import com.revworkforce.common.enums.LeaveType;
import com.revworkforce.common.enums.NotificationType;
import com.revworkforce.common.exception.BadRequestException;
import com.revworkforce.common.exception.ResourceNotFoundException;
import com.revworkforce.common.exception.UnauthorizedException;
import com.revworkforce.leave.client.NotificationClient;
import com.revworkforce.leave.dto.request.ApplyLeaveRequest;
import com.revworkforce.leave.dto.request.LeaveActionRequest;
import com.revworkforce.leave.entity.LeaveApplication;
import com.revworkforce.leave.entity.LeaveBalance;
import com.revworkforce.leave.repository.LeaveApplicationRepository;
import com.revworkforce.leave.repository.LeaveBalanceRepository;
import com.revworkforce.leave.service.LeaveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {

    private final LeaveApplicationRepository leaveApplicationRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final NotificationClient notificationClient;

    @Override
    @Transactional
    public LeaveApplication applyLeave(Long employeeId, String employeeName, Long managerId,
            ApplyLeaveRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }
        List<LeaveApplication> overlapping = leaveApplicationRepository.findOverlapping(
                employeeId, request.getStartDate(), request.getEndDate());
        if (!overlapping.isEmpty()) {
            throw new BadRequestException("You already have a leave application for this period");
        }
        int year = request.getStartDate().getYear();
        int workingDays = calculateWorkingDays(request.getStartDate(), request.getEndDate());
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeAndYear(employeeId, request.getLeaveType(), year)
                .orElseThrow(() -> new BadRequestException(
                        "No leave balance configured for " + request.getLeaveType() + " in year " + year));
        if (balance.getRemainingDays() < workingDays) {
            throw new BadRequestException("Insufficient leave balance. Available: "
                    + balance.getRemainingDays() + " days, Requested: " + workingDays + " days");
        }
        LeaveApplication leave = LeaveApplication.builder()
                .employeeId(employeeId)
                .employeeName(employeeName)
                .managerId(managerId)
                .leaveType(request.getLeaveType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .numberOfDays(workingDays)
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .build();
        LeaveApplication saved = leaveApplicationRepository.save(leave);
        if (managerId != null) {
            sendNotification(managerId, "New Leave Request",
                    employeeName + " applied for " + request.getLeaveType() + " from "
                            + request.getStartDate() + " to " + request.getEndDate(),
                    NotificationType.LEAVE_APPLIED, String.valueOf(saved.getLeaveId()));
        }
        return saved;
    }

    @Override
    @Transactional
    public LeaveApplication cancelLeave(Long leaveId, Long employeeId) {
        LeaveApplication leave = leaveApplicationRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave", "id", leaveId));
        if (!leave.getEmployeeId().equals(employeeId)) {
            throw new UnauthorizedException("You can only cancel your own leave applications");
        }
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only pending leave applications can be cancelled");
        }
        leave.setStatus(LeaveStatus.CANCELLED);
        return leaveApplicationRepository.save(leave);
    }

    @Override
    public LeaveApplication getLeaveById(Long leaveId) {
        return leaveApplicationRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave", "id", leaveId));
    }

    @Override
    public PageResponse<LeaveApplication> getMyLeaves(Long employeeId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        return PageResponse.of(leaveApplicationRepository.findByEmployeeId(employeeId, pageable));
    }

    @Override
    public PageResponse<LeaveApplication> getTeamLeaves(Long managerId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        return PageResponse.of(leaveApplicationRepository.findByManagerId(managerId, pageable));
    }

    @Override
    @Transactional
    public LeaveApplication approveLeave(Long leaveId, Long managerId, LeaveActionRequest request) {
        LeaveApplication leave = leaveApplicationRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave", "id", leaveId));
        if (!leave.getManagerId().equals(managerId)) {
            throw new UnauthorizedException("You are not the manager for this leave request");
        }
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only pending leaves can be approved");
        }
        int year = leave.getStartDate().getYear();
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeAndYear(leave.getEmployeeId(), leave.getLeaveType(), year)
                .orElseThrow(() -> new BadRequestException("No leave balance found"));
        balance.setUsedDays(balance.getUsedDays() + leave.getNumberOfDays());
        leaveBalanceRepository.save(balance);
        leave.setStatus(LeaveStatus.APPROVED);
        leave.setManagerComments(request != null ? request.getComments() : null);
        leave.setReviewedBy(managerId);
        leave.setReviewedAt(LocalDateTime.now());
        LeaveApplication saved = leaveApplicationRepository.save(leave);
        sendNotification(leave.getEmployeeId(), "Leave Approved",
                "Your " + leave.getLeaveType() + " from " + leave.getStartDate()
                        + " to " + leave.getEndDate() + " has been approved",
                NotificationType.LEAVE_APPROVED, String.valueOf(leaveId));
        return saved;
    }

    @Override
    @Transactional
    public LeaveApplication rejectLeave(Long leaveId, Long managerId, LeaveActionRequest request) {
        LeaveApplication leave = leaveApplicationRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave", "id", leaveId));
        if (!leave.getManagerId().equals(managerId)) {
            throw new UnauthorizedException("You are not the manager for this leave request");
        }
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only pending leaves can be rejected");
        }
        if (request == null || request.getComments() == null || request.getComments().isBlank()) {
            throw new BadRequestException("Comments are mandatory when rejecting a leave");
        }
        leave.setStatus(LeaveStatus.REJECTED);
        leave.setManagerComments(request.getComments());
        leave.setReviewedBy(managerId);
        leave.setReviewedAt(LocalDateTime.now());
        LeaveApplication saved = leaveApplicationRepository.save(leave);
        sendNotification(leave.getEmployeeId(), "Leave Rejected",
                "Your " + leave.getLeaveType() + " from " + leave.getStartDate()
                        + " to " + leave.getEndDate() + " has been rejected. Reason: " + request.getComments(),
                NotificationType.LEAVE_REJECTED, String.valueOf(leaveId));
        return saved;
    }

    @Override
    public List<LeaveBalance> getMyLeaveBalances(Long employeeId) {
        int currentYear = LocalDate.now().getYear();
        return leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, currentYear);
    }

    @Override
    public List<LeaveBalance> getLeaveBalanceByEmployee(Long employeeId) {
        return leaveBalanceRepository.findByEmployeeId(employeeId);
    }

    @Override
    @Transactional
    public LeaveBalance assignLeaveQuota(Long employeeId, String leaveType, int totalDays, int year) {
        LeaveType type = LeaveType.valueOf(leaveType.toUpperCase());
        Optional<LeaveBalance> existing = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeAndYear(employeeId, type, year);
        LeaveBalance balance;
        if (existing.isPresent()) {
            balance = existing.get();
            balance.setTotalDays(totalDays);
        } else {
            balance = LeaveBalance.builder()
                    .employeeId(employeeId).leaveType(type)
                    .totalDays(totalDays).usedDays(0).year(year).build();
        }
        return leaveBalanceRepository.save(balance);
    }

    @Override
    @Transactional
    public LeaveBalance adjustLeaveBalance(Long employeeId, String leaveType, int days,
            String reason, int year) {
        LeaveType type = LeaveType.valueOf(leaveType.toUpperCase());
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeAndYear(employeeId, type, year)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Leave balance not found for employee: " + employeeId));
        balance.setTotalDays(balance.getTotalDays() + days);
        log.info("Leave balance adjusted: employee={}, type={}, days={}, reason={}", employeeId, type, days, reason);
        return leaveBalanceRepository.save(balance);
    }

    @Override
    public PageResponse<LeaveApplication> getAllLeaves(int page, int size, String status,
            Long employeeId, Long departmentId) {
        LeaveStatus leaveStatus = null;
        if (status != null && !status.isBlank()) {
            try { leaveStatus = LeaveStatus.valueOf(status.toUpperCase()); } catch (IllegalArgumentException ignored) {}
        }
        PageRequest pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<LeaveApplication> result = leaveApplicationRepository.findAllFiltered(
                leaveStatus, employeeId, pageable);
        return PageResponse.of(result);
    }

    @Override
    public long countPendingLeaves() {
        return leaveApplicationRepository.countByStatus(LeaveStatus.PENDING);
    }

    @Override
    public long countApprovedLeavesToday() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        return leaveApplicationRepository.countApprovedToday(start, start.plusDays(1));
    }

    @Override
    public long countLeavesByStatus(String status) {
        try {
            return leaveApplicationRepository.countByStatus(LeaveStatus.valueOf(status.toUpperCase()));
        } catch (Exception e) {
            return 0L;
        }
    }

    @Override
    public Object getLeaveReport(String type, Integer year, Long departmentId) {
        int reportYear = (year != null) ? year : LocalDate.now().getYear();
        Map<String, Object> report = new HashMap<>();
        report.put("reportType", type);
        report.put("year", reportYear);
        report.put("totalPending", leaveApplicationRepository.countByStatus(LeaveStatus.PENDING));
        report.put("totalApproved", leaveApplicationRepository.countByStatus(LeaveStatus.APPROVED));
        report.put("totalRejected", leaveApplicationRepository.countByStatus(LeaveStatus.REJECTED));
        Map<String, Long> byType = new HashMap<>();
        leaveApplicationRepository.countByLeaveTypeGrouped()
                .forEach(row -> byType.put(row[0].toString(), (Long) row[1]));
        report.put("byLeaveType", byType);
        return report;
    }

    @Override
    public List<LeaveApplication> getTeamLeaveCalendar(Long managerId) {
        LocalDate from = LocalDate.now().withDayOfMonth(1);
        return leaveApplicationRepository.findByManagerIdAndStartDateBetween(
                managerId, from, from.plusMonths(3));
    }

    private int calculateWorkingDays(LocalDate start, LocalDate end) {
        int days = 0;
        LocalDate current = start;
        while (!current.isAfter(end)) {
            DayOfWeek day = current.getDayOfWeek();
            if (day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY) days++;
            current = current.plusDays(1);
        }
        return days;
    }

    private void sendNotification(Long recipientId, String title, String message,
            NotificationType type, String referenceId) {
        try {
            notificationClient.sendNotification(NotificationRequest.builder()
                    .recipientUserId(recipientId).title(title).message(message).type(type)
                    .referenceId(referenceId).referenceType("LEAVE").build());
        } catch (Exception e) {
            log.warn("Failed to send notification: {}", e.getMessage());
        }
    }
}
