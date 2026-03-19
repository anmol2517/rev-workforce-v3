package com.revworkforce.performance.service;

import com.revworkforce.performance.dto.request.*;
import com.revworkforce.performance.entity.Goal;
import com.revworkforce.performance.entity.PerformanceReview;

import java.util.List;
import java.util.Map;

public interface PerformanceService {
    PerformanceReview createOrUpdateReview(Long employeeId, String employeeName, Long managerId, CreateReviewRequest request);
    PerformanceReview submitReview(Long reviewId, Long employeeId);
    PerformanceReview getReviewById(Long reviewId);
    List<PerformanceReview> getMyReviews(Long employeeId);
    List<PerformanceReview> getTeamReviews(Long managerId);
    List<PerformanceReview> getTeamSubmittedReviews(Long managerId);
    PerformanceReview provideManagerFeedback(Long reviewId, Long managerId, ManagerFeedbackRequest request);

    Goal createGoal(Long employeeId, Long managerId, CreateGoalRequest request);
    Goal assignGoalByManager(Long managerId, Long employeeId, CreateGoalRequest request);
    Goal updateGoalProgress(Long goalId, Long employeeId, UpdateGoalProgressRequest request);
    Goal addManagerComment(Long goalId, Long managerId, ManagerGoalCommentRequest request);
    Goal getGoalById(Long goalId);
    List<Goal> getMyGoals(Long employeeId);
    List<Goal> getMyGoalsByYear(Long employeeId, int year);
    List<Goal> getMyAssignedGoals(Long employeeId);
    List<Goal> getTeamGoals(Long managerId);
    List<Goal> getTeamActiveGoals(Long managerId);

    long countTotalGoals();
    Map<String, Long> countGoalsByStatus();
    long countAssignedGoalsByManager(Long managerId);
    long countPendingReviewsForManager(Long managerId);
    Map<String, Long> getGoalSummaryByEmployee(Long employeeId);
    Object getReviewsByEmployee(Long employeeId);
    Object getGoalsByEmployee(Long employeeId);
}
