package com.revworkforce.leave.entity;

import com.revworkforce.common.enums.LeaveStatus;
import com.revworkforce.common.enums.LeaveType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leaveId;

    @Column(nullable = false)
    private Long employeeId;

    @Column
    private String employeeName;

    @Column
    private Long managerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveType leaveType;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private int numberOfDays;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private LeaveStatus status = LeaveStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String managerComments;

    @Column
    private Long reviewedBy;

    @Column
    private LocalDateTime reviewedAt;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime appliedAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
