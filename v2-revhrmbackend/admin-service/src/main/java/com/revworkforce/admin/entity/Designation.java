package com.revworkforce.admin.entity;

import com.revworkforce.common.enums.DesignationLevel;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "designations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Designation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long designationId;

    @Column(nullable = false, unique = true)
    private String title;

    @Column
    private String description;

    @Column
    private Long departmentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DesignationLevel level = DesignationLevel.JUNIOR;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}