package com.revworkforce.performance.service;

import com.revworkforce.common.enums.GoalStatus;
import com.revworkforce.common.enums.Priority;
import com.revworkforce.common.enums.ReviewStatus;
import com.revworkforce.common.exception.BadRequestException;
import com.revworkforce.common.exception.UnauthorizedException;
import com.revworkforce.performance.client.NotificationClient;
import com.revworkforce.performance.dto.request.*;
import com.revworkforce.performance.entity.Goal;
import com.revworkforce.performance.entity.PerformanceReview;
import com.revworkforce.performance.repository.GoalRepository;
import com.revworkforce.performance.repository.PerformanceReviewRepository;
import com.revworkforce.performance.serviceImpl.PerformanceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PerformanceServiceTest {

    @Mock private PerformanceReviewRepository reviewRepository;
    @Mock private GoalRepository goalRepository;
    @Mock private NotificationClient notificationClient;

    @InjectMocks private PerformanceServiceImpl performanceService;

    private PerformanceReview draftReview;
    private PerformanceReview submittedReview;
    private Goal goal;

    @BeforeEach
    void setUp() {
        draftReview = PerformanceReview.builder()
                .reviewId(1L).employeeId(1L).managerId(2L)
                .reviewYear(2025).status(ReviewStatus.DRAFT).build();

        submittedReview = PerformanceReview.builder()
                .reviewId(2L).employeeId(1L).managerId(2L)
                .reviewYear(2025).status(ReviewStatus.SUBMITTED).build();

        goal = Goal.builder()
                .goalId(1L).employeeId(1L).managerId(2L)
                .title("Complete project").priority(Priority.HIGH)
                .status(GoalStatus.NOT_STARTED).deadline(LocalDate.now().plusMonths(3))
                .year(2025).build();
    }

    @Test
    void submitReview_NotOwner_ThrowsUnauthorized() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(draftReview));
        assertThatThrownBy(() -> performanceService.submitReview(1L, 99L))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void submitReview_NotDraft_ThrowsBadRequest() {
        when(reviewRepository.findById(2L)).thenReturn(Optional.of(submittedReview));
        assertThatThrownBy(() -> performanceService.submitReview(2L, 1L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("draft");
    }

    @Test
    void submitReview_Success() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(draftReview));
        when(reviewRepository.save(any())).thenReturn(draftReview);
        when(notificationClient.sendNotification(any())).thenReturn(null);

        PerformanceReview result = performanceService.submitReview(1L, 1L);

        verify(reviewRepository).save(argThat(r -> r.getStatus() == ReviewStatus.SUBMITTED));
    }

    @Test
    void provideManagerFeedback_WrongManager_ThrowsUnauthorized() {
        when(reviewRepository.findById(2L)).thenReturn(Optional.of(submittedReview));
        assertThatThrownBy(() -> performanceService.provideManagerFeedback(2L, 99L,
                ManagerFeedbackRequest.builder().managerFeedback("Good").managerRating(4).build()))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void updateGoalProgress_NotOwner_ThrowsUnauthorized() {
        when(goalRepository.findById(1L)).thenReturn(Optional.of(goal));
        assertThatThrownBy(() -> performanceService.updateGoalProgress(1L, 99L,
                UpdateGoalProgressRequest.builder().status(GoalStatus.IN_PROGRESS).progressPercent(50).build()))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void createGoal_Success() {
        when(goalRepository.save(any())).thenReturn(goal);
        CreateGoalRequest req = CreateGoalRequest.builder()
                .title("Complete project").deadline(LocalDate.now().plusMonths(3))
                .priority(Priority.HIGH).build();

        Goal result = performanceService.createGoal(1L, 2L, req);

        assertThat(result).isNotNull();
        verify(goalRepository, times(1)).save(any());
    }

    @Test
    void getMyGoals_ReturnsGoals() {
        when(goalRepository.findByEmployeeId(1L)).thenReturn(List.of(goal));
        List<Goal> result = performanceService.getMyGoals(1L);
        assertThat(result).hasSize(1);
    }
}
