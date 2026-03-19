package com.revworkforce.leave.service;

import com.revworkforce.common.enums.LeaveStatus;
import com.revworkforce.common.enums.LeaveType;
import com.revworkforce.common.exception.BadRequestException;
import com.revworkforce.common.exception.UnauthorizedException;
import com.revworkforce.leave.client.NotificationClient;
import com.revworkforce.leave.dto.request.ApplyLeaveRequest;
import com.revworkforce.leave.dto.request.LeaveActionRequest;
import com.revworkforce.leave.entity.LeaveApplication;
import com.revworkforce.leave.entity.LeaveBalance;
import com.revworkforce.leave.repository.LeaveApplicationRepository;
import com.revworkforce.leave.repository.LeaveBalanceRepository;
import com.revworkforce.leave.serviceImpl.LeaveServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// FIX: LENIENT strictness — prevents UnnecessaryStubbingException
// when notification mock is stubbed but sendNotification() fails silently in try-catch
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class LeaveServiceTest {

    @Mock private LeaveApplicationRepository leaveApplicationRepository;
    @Mock private LeaveBalanceRepository leaveBalanceRepository;
    @Mock private NotificationClient notificationClient;

    @InjectMocks private LeaveServiceImpl leaveService;

    private ApplyLeaveRequest applyRequest;
    private LeaveBalance balance;
    private LeaveApplication pendingLeave;

    @BeforeEach
    void setUp() {
        applyRequest = ApplyLeaveRequest.builder()
                .leaveType(LeaveType.CASUAL_LEAVE)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(3))
                .reason("Personal work")
                .build();

        balance = LeaveBalance.builder()
                .balanceId(1L).employeeId(1L)
                .leaveType(LeaveType.CASUAL_LEAVE)
                .totalDays(12).usedDays(0)
                .year(LocalDate.now().getYear())
                .build();

        pendingLeave = LeaveApplication.builder()
                .leaveId(1L).employeeId(1L).managerId(2L)
                .leaveType(LeaveType.CASUAL_LEAVE)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(3))
                .numberOfDays(3).reason("Personal work")
                .status(LeaveStatus.PENDING)
                .build();
    }

    @Test
    void applyLeave_EndBeforeStart_ThrowsBadRequest() {
        // endDate < startDate → triggers "End date cannot be before start date"
        applyRequest.setEndDate(LocalDate.now().minusDays(1));

        assertThatThrownBy(() -> leaveService.applyLeave(1L, "John", 2L, applyRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("End date");
    }

    @Test
    void applyLeave_InsufficientBalance_ThrowsBadRequest() {
        // FIX: usedDays=12 out of totalDays=12 → remainingDays=0
        // applyRequest asks for plusDays(1) to plusDays(3) = working days > 0 → "Insufficient"
        balance.setUsedDays(12);

        when(leaveApplicationRepository.findOverlapping(any(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(leaveBalanceRepository.findByEmployeeIdAndLeaveTypeAndYear(any(), any(), anyInt()))
                .thenReturn(Optional.of(balance));

        assertThatThrownBy(() -> leaveService.applyLeave(1L, "John", 2L, applyRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Insufficient");
    }

    @Test
    void applyLeave_Success() {
        when(leaveApplicationRepository.findOverlapping(any(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(leaveBalanceRepository.findByEmployeeIdAndLeaveTypeAndYear(any(), any(), anyInt()))
                .thenReturn(Optional.of(balance));
        when(leaveApplicationRepository.save(any())).thenReturn(pendingLeave);

        LeaveApplication result = leaveService.applyLeave(1L, "John", 2L, applyRequest);

        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(LeaveStatus.PENDING);
        verify(leaveApplicationRepository, times(1)).save(any());
    }

    @Test
    void cancelLeave_NotOwner_ThrowsUnauthorized() {
        when(leaveApplicationRepository.findById(1L)).thenReturn(Optional.of(pendingLeave));

        assertThatThrownBy(() -> leaveService.cancelLeave(1L, 99L))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void cancelLeave_Success() {
        when(leaveApplicationRepository.findById(1L)).thenReturn(Optional.of(pendingLeave));
        when(leaveApplicationRepository.save(any())).thenReturn(pendingLeave);

        leaveService.cancelLeave(1L, 1L);

        verify(leaveApplicationRepository).save(argThat(l -> l.getStatus() == LeaveStatus.CANCELLED));
    }

    @Test
    void rejectLeave_NoComments_ThrowsBadRequest() {
        pendingLeave.setManagerId(2L);
        when(leaveApplicationRepository.findById(1L)).thenReturn(Optional.of(pendingLeave));

        assertThatThrownBy(() -> leaveService.rejectLeave(1L, 2L,
                LeaveActionRequest.builder().comments("").build()))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("mandatory");
    }

    @Test
    void approveLeave_WrongManager_ThrowsUnauthorized() {
        when(leaveApplicationRepository.findById(1L)).thenReturn(Optional.of(pendingLeave));

        assertThatThrownBy(() -> leaveService.approveLeave(1L, 99L, null))
                .isInstanceOf(UnauthorizedException.class);
    }
}