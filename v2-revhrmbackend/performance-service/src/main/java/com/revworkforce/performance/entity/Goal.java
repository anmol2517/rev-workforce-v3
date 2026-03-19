package com.revworkforce.performance.entity;

import com.revworkforce.common.enums.GoalStatus;
import com.revworkforce.common.enums.Priority;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long goalId;

    @Column(nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private GoalStatus status = GoalStatus.NOT_STARTED;

    @Column
    @Builder.Default
    private Integer progressPercent = 0;

    @Column(columnDefinition = "TEXT")
    private String managerComments;

    @Column
    private Long managerId;

    @Column(nullable = false)
    @Builder.Default
    private boolean assignedByManager = false;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
