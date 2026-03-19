package com.revworkforce.performance.serviceImpl;

import com.revworkforce.common.dto.NotificationRequest;
import com.revworkforce.common.enums.GoalStatus;
import com.revworkforce.common.enums.NotificationType;
import com.revworkforce.common.enums.ReviewStatus;
import com.revworkforce.common.exception.BadRequestException;
import com.revworkforce.common.exception.ResourceNotFoundException;
import com.revworkforce.common.exception.UnauthorizedException;
import com.revworkforce.performance.client.NotificationClient;
import com.revworkforce.performance.dto.request.*;
import com.revworkforce.performance.entity.Goal;
import com.revworkforce.performance.entity.PerformanceReview;
import com.revworkforce.performance.repository.GoalRepository;
import com.revworkforce.performance.repository.PerformanceReviewRepository;
import com.revworkforce.performance.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PerformanceServiceImpl implements PerformanceService {

    private final PerformanceReviewRepository reviewRepository;
    private final GoalRepository goalRepository;
    private final NotificationClient notificationClient;

    // ── HELPER: Check karo ki employee is manager ke under hai ──
    private void validateManagerEmployeeRelation(Long managerId, Long employeeId) {
        // Manager apne team ke employees ko hi access kar sakta hai
        // Goals table mein check karo ya direct managerId match
        // Agar employee ka koi bhi goal/review is managerId se linked nahi hai
        // aur employee apna managerId bhi nahi batata (no employee-service call here)
        // So: check karo ki goal/review create karte waqt managerId match ho
        // Simple rule: manager sirf unhe assign kar sakta hai jinka managerId = manager ka employeeId
        // Ye check GoalRepository se karte hain
        boolean isTeamMember = goalRepository.existsByEmployeeIdAndManagerId(employeeId, managerId);
        // Agar pehla goal hai toh allow karo — but employeeId valid hona chahiye
        // Security: manager sirf apne department ke employees ko assign kar sakta hai
        // Hum ye enforce karte hain: agar kisi aur manager ka employee hai toh reject karo
        List<Goal> otherManagerGoals = goalRepository.findByEmployeeId(employeeId);
        if (!otherManagerGoals.isEmpty()) {
            boolean belongsToOtherManager = otherManagerGoals.stream()
                    .anyMatch(g -> g.getManagerId() != null && !g.getManagerId().equals(managerId));
            if (belongsToOtherManager) {
                throw new UnauthorizedException("Employee " + employeeId + " does not belong to your team");
            }
        }

        // Review bhi check karo
        List<PerformanceReview> reviews = reviewRepository.findByEmployeeId(employeeId);
        if (!reviews.isEmpty()) {
            boolean belongsToOtherManagerReview = reviews.stream()
                    .anyMatch(r -> r.getManagerId() != null && !r.getManagerId().equals(managerId));
            if (belongsToOtherManagerReview) {
                throw new UnauthorizedException("Employee " + employeeId + " does not belong to your team");
            }
        }
    }

    @Override
    @Transactional
    public PerformanceReview createOrUpdateReview(Long employeeId, String employeeName,
                                                  Long managerId, CreateReviewRequest request) {
        int year = LocalDate.now().getYear();
        PerformanceReview review = reviewRepository
                .findByEmployeeIdAndReviewYear(employeeId, year)
                .orElse(PerformanceReview.builder()
                        .employeeId(employeeId)
                        .employeeName(employeeName)
                        .managerId(managerId)
                        .reviewYear(year)
                        .status(ReviewStatus.DRAFT)
                        .build());

        if (review.getStatus() == ReviewStatus.SUBMITTED
                || review.getStatus() == ReviewStatus.FEEDBACK_PROVIDED
                || review.getStatus() == ReviewStatus.COMPLETED) {
            throw new BadRequestException("Review already submitted and cannot be modified");
        }

        review.setKeyDeliverables(request.getKeyDeliverables());
        review.setAccomplishments(request.getAccomplishments());
        review.setAreasOfImprovement(request.getAreasOfImprovement());
        review.setSelfRating(request.getSelfRating());
        return reviewRepository.save(review);
    }

    @Override
    @Transactional
    public PerformanceReview submitReview(Long reviewId, Long employeeId) {
        PerformanceReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        if (!review.getEmployeeId().equals(employeeId)) {
            throw new UnauthorizedException("You can only submit your own review");
        }
        if (review.getStatus() != ReviewStatus.DRAFT) {
            throw new BadRequestException("Only draft reviews can be submitted");
        }
        review.setStatus(ReviewStatus.SUBMITTED);
        review.setSubmittedAt(LocalDateTime.now());
        PerformanceReview saved = reviewRepository.save(review);
        sendNotification(review.getManagerId(), "Performance Review Submitted",
                review.getEmployeeName() + " has submitted their performance review for " + review.getReviewYear(),
                NotificationType.PERFORMANCE_REVIEW_SUBMITTED, String.valueOf(reviewId));
        return saved;
    }

    @Override
    public PerformanceReview getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
    }

    @Override
    public List<PerformanceReview> getMyReviews(Long employeeId) {
        return reviewRepository.findByEmployeeId(employeeId);
    }

    @Override
    public List<PerformanceReview> getTeamReviews(Long managerId) {
        // Sirf apni team ke reviews
        return reviewRepository.findByManagerId(managerId);
    }

    @Override
    public List<PerformanceReview> getTeamSubmittedReviews(Long managerId) {
        // Sirf apni team ke submitted reviews
        return reviewRepository.findByManagerIdAndStatus(managerId, ReviewStatus.SUBMITTED);
    }

    @Override
    @Transactional
    public PerformanceReview provideManagerFeedback(Long reviewId, Long managerId,
                                                    ManagerFeedbackRequest request) {
        PerformanceReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        // SECURITY: Sirf apni team ke review pe feedback de sakta hai
        if (!review.getManagerId().equals(managerId)) {
            throw new UnauthorizedException("You are not the manager for this review");
        }
        if (review.getStatus() != ReviewStatus.SUBMITTED) {
            throw new BadRequestException("Feedback can only be provided on submitted reviews");
        }
        review.setManagerFeedback(request.getManagerFeedback());
        review.setManagerRating(request.getManagerRating());
        review.setStatus(ReviewStatus.FEEDBACK_PROVIDED);
        review.setFeedbackProvidedAt(LocalDateTime.now());
        PerformanceReview saved = reviewRepository.save(review);
        sendNotification(review.getEmployeeId(), "Performance Feedback Received",
                "Your manager has provided feedback on your performance review for " + review.getReviewYear(),
                NotificationType.PERFORMANCE_FEEDBACK_PROVIDED, String.valueOf(reviewId));
        return saved;
    }

    @Override
    @Transactional
    public Goal createGoal(Long employeeId, Long managerId, CreateGoalRequest request) {
        Goal goal = Goal.builder()
                .employeeId(employeeId)
                .managerId(managerId)
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .priority(request.getPriority())
                .year(LocalDate.now().getYear())
                .progressPercent(0)
                .assignedByManager(false)
                .build();
        return goalRepository.save(goal);
    }

    @Override
    @Transactional
    public Goal assignGoalByManager(Long managerId, Long employeeId, CreateGoalRequest request) {
        validateManagerEmployeeRelation(managerId, employeeId);

        Goal goal = Goal.builder()
                .employeeId(employeeId)
                .managerId(managerId)
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .priority(request.getPriority())
                .year(LocalDate.now().getYear())
                .progressPercent(0)
                .assignedByManager(true)
                .build();
        Goal saved = goalRepository.save(goal);
        sendNotification(employeeId, "New Goal Assigned",
                "Your manager has assigned you a new goal: " + request.getTitle(),
                NotificationType.GOAL_UPDATED, String.valueOf(saved.getGoalId()));
        return saved;
    }

    @Override
    @Transactional
    public Goal updateGoalProgress(Long goalId, Long employeeId, UpdateGoalProgressRequest request) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal", "id", goalId));
        // SECURITY: Employee sirf apna goal update kar sakta hai
        if (!goal.getEmployeeId().equals(employeeId)) {
            throw new UnauthorizedException("You can only update your own goals");
        }
        goal.setStatus(request.getStatus());
        if (request.getProgressPercent() != null) goal.setProgressPercent(request.getProgressPercent());
        if (request.getDescription() != null) goal.setDescription(request.getDescription());
        return goalRepository.save(goal);
    }

    @Override
    @Transactional
    public Goal addManagerComment(Long goalId, Long managerId, ManagerGoalCommentRequest request) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal", "id", goalId));
        // SECURITY: Sirf apni team ke goal pe comment kar sakta hai
        if (!managerId.equals(goal.getManagerId())) {
            throw new UnauthorizedException("You are not the manager for this goal");
        }
        goal.setManagerComments(request.getComment());
        return goalRepository.save(goal);
    }

    @Override
    public Goal getGoalById(Long goalId) {
        return goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal", "id", goalId));
    }

    @Override
    public List<Goal> getMyGoals(Long employeeId) {
        return goalRepository.findByEmployeeId(employeeId);
    }

    @Override
    public List<Goal> getMyGoalsByYear(Long employeeId, int year) {
        return goalRepository.findByEmployeeIdAndYear(employeeId, year);
    }

    @Override
    public List<Goal> getMyAssignedGoals(Long employeeId) {
        return goalRepository.findByEmployeeIdAndAssignedByManager(employeeId, true);
    }

    @Override
    public List<Goal> getTeamGoals(Long managerId) {
        // Sirf apni team ke goals
        return goalRepository.findByManagerId(managerId);
    }

    @Override
    public List<Goal> getTeamActiveGoals(Long managerId) {
        // Sirf apni team ke active goals
        return goalRepository.findActiveGoalsByManager(managerId);
    }

    @Override
    public long countTotalGoals() {
        return goalRepository.count();
    }

    @Override
    public Map<String, Long> countGoalsByStatus() {
        Map<String, Long> result = new HashMap<>();
        goalRepository.countByStatusGrouped()
                .forEach(row -> result.put(row[0].toString(), (Long) row[1]));
        return result;
    }

    @Override
    public long countAssignedGoalsByManager(Long managerId) {
        return goalRepository.countAssignedByManager(managerId);
    }

    @Override
    public long countPendingReviewsForManager(Long managerId) {
        return reviewRepository.countPendingReviewsForManager(managerId);
    }

    @Override
    public Map<String, Long> getGoalSummaryByEmployee(Long employeeId) {
        Map<String, Long> summary = new HashMap<>();
        summary.put("total", (long) goalRepository.findByEmployeeId(employeeId).size());
        summary.put("completed", goalRepository.countByEmployeeIdAndStatus(employeeId, GoalStatus.COMPLETED));
        summary.put("inProgress", goalRepository.countByEmployeeIdAndStatus(employeeId, GoalStatus.IN_PROGRESS));
        summary.put("notStarted", goalRepository.countByEmployeeIdAndStatus(employeeId, GoalStatus.NOT_STARTED));
        return summary;
    }

    @Override
    public Object getReviewsByEmployee(Long employeeId) {
        return reviewRepository.findByEmployeeId(employeeId);
    }

    @Override
    public Object getGoalsByEmployee(Long employeeId) {
        return goalRepository.findByEmployeeId(employeeId);
    }

    private void sendNotification(Long recipientId, String title, String message,
                                  NotificationType type, String referenceId) {
        try {
            notificationClient.sendNotification(NotificationRequest.builder()
                    .recipientUserId(recipientId)
                    .title(title).message(message).type(type)
                    .referenceId(referenceId).referenceType("PERFORMANCE")
                    .build());
        } catch (Exception e) {
            log.warn("Notification failed: {}", e.getMessage());
        }
    }
}