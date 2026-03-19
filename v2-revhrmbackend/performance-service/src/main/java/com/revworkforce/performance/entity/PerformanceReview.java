package com.revworkforce.performance.entity;

import com.revworkforce.common.enums.ReviewStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance_reviews")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PerformanceReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @Column(nullable = false)
    private Long employeeId;

    @Column
    private String employeeName;

    @Column(nullable = false)
    private Long managerId;

    @Column(nullable = false)
    private int reviewYear;

    @Column(columnDefinition = "TEXT")
    private String keyDeliverables;

    @Column(columnDefinition = "TEXT")
    private String accomplishments;

    @Column(columnDefinition = "TEXT")
    private String areasOfImprovement;

    @Column
    private Integer selfRating;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReviewStatus status = ReviewStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String managerFeedback;

    @Column
    private Integer managerRating;

    @Column
    private LocalDateTime submittedAt;

    @Column
    private LocalDateTime feedbackProvidedAt;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
