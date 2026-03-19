package com.revworkforce.performance.controller;

import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.exception.UnauthorizedException;
import com.revworkforce.performance.client.EmployeeClient;
import com.revworkforce.performance.dto.request.*;
import com.revworkforce.performance.entity.Goal;
import com.revworkforce.performance.entity.PerformanceReview;
import com.revworkforce.performance.security.RequestContext;
import com.revworkforce.performance.service.PerformanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
@Tag(name = "Performance Management", description = "Reviews, goals, feedback")
public class PerformanceController {

    private final PerformanceService performanceService;
    private final RequestContext requestContext;
    private final EmployeeClient employeeClient;

    @PostMapping("/reviews")
    @Operation(summary = "Employee: Create or update performance review (draft)")
    public ResponseEntity<ApiResponse<PerformanceReview>> createOrUpdateReview(
            @Valid @RequestBody CreateReviewRequest request) {
        Long employeeId = requestContext.getCurrentEmployeeId();
        String name = requestContext.getCurrentUserEmail();
        Long managerId = null;

        // PERMANENT FIX: managerId employee-service se fetch karo
        try {
            Long userId = requestContext.getCurrentUserId();
            var empResponse = employeeClient.getEmployeeByUserId(userId);
            if (empResponse != null && empResponse.isSuccess() && empResponse.getData() != null) {
                managerId = empResponse.getData().getManagerId();
                String fn = empResponse.getData().getFirstName();
                String ln = empResponse.getData().getLastName();
                if (fn != null) name = fn + " " + (ln != null ? ln : "");
            }
        } catch (Exception e) {
            log.warn("Could not fetch manager from employee-service: {}", e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                performanceService.createOrUpdateReview(employeeId, name, managerId, request),
                "Review saved as draft"));
    }

    @PutMapping("/reviews/{reviewId}/submit")
    @Operation(summary = "Employee: Submit review to manager")
    public ResponseEntity<ApiResponse<PerformanceReview>> submitReview(
            @PathVariable Long reviewId) {
        Long employeeId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.submitReview(reviewId, employeeId), "Review submitted"));
    }

    @GetMapping("/reviews/my")
    @Operation(summary = "Employee: View my own reviews only")
    public ResponseEntity<ApiResponse<List<PerformanceReview>>> getMyReviews() {
        Long employeeId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(performanceService.getMyReviews(employeeId)));
    }

    @GetMapping("/reviews/{reviewId}")
    @Operation(summary = "Get review by ID — only own or team review")
    public ResponseEntity<ApiResponse<PerformanceReview>> getReviewById(
            @PathVariable Long reviewId) {
        Long currentEmployeeId = requestContext.getCurrentEmployeeId();
        PerformanceReview review = performanceService.getReviewById(reviewId);
        if (!review.getEmployeeId().equals(currentEmployeeId)
                && !review.getManagerId().equals(currentEmployeeId)) {
            throw new UnauthorizedException("You are not authorized to view this review");
        }
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    @PostMapping("/goals")
    @Operation(summary = "Employee: Create own goal")
    public ResponseEntity<ApiResponse<Goal>> createGoal(
            @Valid @RequestBody CreateGoalRequest request) {
        Long employeeId = requestContext.getCurrentEmployeeId();
        Long managerId = null;

        // PERMANENT FIX: managerId employee-service se fetch karo
        try {
            Long userId = requestContext.getCurrentUserId();
            var empResponse = employeeClient.getEmployeeByUserId(userId);
            if (empResponse != null && empResponse.isSuccess() && empResponse.getData() != null) {
                managerId = empResponse.getData().getManagerId();
            }
        } catch (Exception e) {
            log.warn("Could not fetch manager for goal: {}", e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                performanceService.createGoal(employeeId, managerId, request), "Goal created"));
    }

    @GetMapping("/goals/my")
    @Operation(summary = "Employee: View all my goals")
    public ResponseEntity<ApiResponse<List<Goal>>> getMyGoals() {
        Long employeeId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(performanceService.getMyGoals(employeeId)));
    }

    @GetMapping("/goals/my/assigned")
    @Operation(summary = "Employee: View manager-assigned goals")
    public ResponseEntity<ApiResponse<List<Goal>>> getMyAssignedGoals() {
        Long employeeId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.getMyAssignedGoals(employeeId)));
    }

    @GetMapping("/goals/my/year/{year}")
    @Operation(summary = "Employee: View goals by year")
    public ResponseEntity<ApiResponse<List<Goal>>> getMyGoalsByYear(@PathVariable int year) {
        Long employeeId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.getMyGoalsByYear(employeeId, year)));
    }

    @PutMapping("/goals/{goalId}/progress")
    @Operation(summary = "Employee: Update own goal progress only")
    public ResponseEntity<ApiResponse<Goal>> updateGoalProgress(
            @PathVariable Long goalId,
            @Valid @RequestBody UpdateGoalProgressRequest request) {
        Long employeeId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.updateGoalProgress(goalId, employeeId, request),
                "Goal progress updated"));
    }

    @GetMapping("/goals/{goalId}")
    @Operation(summary = "Get goal by ID — only own or team goal")
    public ResponseEntity<ApiResponse<Goal>> getGoalById(@PathVariable Long goalId) {
        Long currentEmployeeId = requestContext.getCurrentEmployeeId();
        Goal goal = performanceService.getGoalById(goalId);
        if (!goal.getEmployeeId().equals(currentEmployeeId)
                && (goal.getManagerId() == null || !goal.getManagerId().equals(currentEmployeeId))) {
            throw new UnauthorizedException("You are not authorized to view this goal");
        }
        return ResponseEntity.ok(ApiResponse.success(goal));
    }

    @GetMapping("/reviews/team")
    @Operation(summary = "Manager: View only own team reviews")
    public ResponseEntity<ApiResponse<List<PerformanceReview>>> getTeamReviews() {
        Long managerId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(performanceService.getTeamReviews(managerId)));
    }

    @GetMapping("/reviews/team/pending")
    @Operation(summary = "Manager: View only own team submitted reviews")
    public ResponseEntity<ApiResponse<List<PerformanceReview>>> getTeamPendingReviews() {
        Long managerId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.getTeamSubmittedReviews(managerId)));
    }

    @PutMapping("/reviews/{reviewId}/feedback")
    @Operation(summary = "Manager: Provide feedback — only own team member review")
    public ResponseEntity<ApiResponse<PerformanceReview>> provideFeedback(
            @PathVariable Long reviewId,
            @Valid @RequestBody ManagerFeedbackRequest request) {
        Long managerId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.provideManagerFeedback(reviewId, managerId, request),
                "Feedback submitted"));
    }

    @PostMapping("/goals/assign")
    @Operation(summary = "Manager: Assign goal — only to own team member")
    public ResponseEntity<ApiResponse<Goal>> assignGoalToEmployee(
            @Valid @RequestBody AssignGoalRequest request) {
        Long managerId = requestContext.getCurrentEmployeeId();
        CreateGoalRequest goalRequest = new CreateGoalRequest();
        goalRequest.setTitle(request.getTitle());
        goalRequest.setDescription(request.getDescription());
        goalRequest.setDeadline(request.getDeadline());
        goalRequest.setPriority(request.getPriority());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                performanceService.assignGoalByManager(managerId, request.getEmployeeId(), goalRequest),
                "Goal assigned"));
    }

    @GetMapping("/goals/team")
    @Operation(summary = "Manager: View only own team goals")
    public ResponseEntity<ApiResponse<List<Goal>>> getTeamGoals() {
        Long managerId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(performanceService.getTeamGoals(managerId)));
    }

    @GetMapping("/goals/team/active")
    @Operation(summary = "Manager: View own team active goals only")
    public ResponseEntity<ApiResponse<List<Goal>>> getTeamActiveGoals() {
        Long managerId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.getTeamActiveGoals(managerId)));
    }

    @PutMapping("/goals/{goalId}/comment")
    @Operation(summary = "Manager: Add comment — only own team member goal")
    public ResponseEntity<ApiResponse<Goal>> addGoalComment(
            @PathVariable Long goalId,
            @Valid @RequestBody ManagerGoalCommentRequest request) {
        Long managerId = requestContext.getCurrentEmployeeId();
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.addManagerComment(goalId, managerId, request), "Comment added"));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "performance-service"));
    }

    @GetMapping("/internal/goals/count")
    public ResponseEntity<ApiResponse<Long>> countTotalGoals() {
        return ResponseEntity.ok(ApiResponse.success(performanceService.countTotalGoals()));
    }

    @GetMapping("/internal/goals/count-by-status")
    public ResponseEntity<ApiResponse<Map<String, Long>>> countGoalsByStatus() {
        return ResponseEntity.ok(ApiResponse.success(performanceService.countGoalsByStatus()));
    }

    @GetMapping("/internal/goals/manager/{managerId}/assigned-count")
    public ResponseEntity<ApiResponse<Long>> countAssignedByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.countAssignedGoalsByManager(managerId)));
    }

    @GetMapping("/internal/reviews/pending-count/{managerId}")
    public ResponseEntity<ApiResponse<Long>> countPendingReviews(@PathVariable Long managerId) {
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.countPendingReviewsForManager(managerId)));
    }

    @GetMapping("/internal/goals/employee/{employeeId}/summary")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getGoalSummary(
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.getGoalSummaryByEmployee(employeeId)));
    }

    @GetMapping("/internal/reviews/employee/{employeeId}")
    public ResponseEntity<ApiResponse<Object>> getReviewsByEmployee(
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.getReviewsByEmployee(employeeId)));
    }

    @GetMapping("/internal/goals/employee/{employeeId}")
    public ResponseEntity<ApiResponse<Object>> getGoalsByEmployee(
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(
                performanceService.getGoalsByEmployee(employeeId)));
    }
}