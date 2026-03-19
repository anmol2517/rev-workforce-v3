package com.revworkforce.admin.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @Column(nullable = true)
    private Long userId;

    @Column(nullable = false)
    private String action;

    @Column
    private String entityType;

    @Column
    private Long entityId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String ipAddress;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
