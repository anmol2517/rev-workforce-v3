package com.revworkforce.admin.entity;

import com.revworkforce.common.enums.LeaveType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_type_configs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveTypeConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private LeaveType leaveType;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private int defaultQuota;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
