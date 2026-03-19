package com.revworkforce.leave.entity;

import com.revworkforce.common.enums.LeaveType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_balances",
       uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id","leave_type","year"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long balanceId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false)
    private LeaveType leaveType;

    @Column(nullable = false)
    private int totalDays;

    @Column(nullable = false)
    @Builder.Default
    private int usedDays = 0;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt;

    public int getRemainingDays() {
        return totalDays - usedDays;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
