package com.revworkforce.admin.entity;

import com.revworkforce.common.enums.HolidayType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "holidays")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Holiday {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long holidayId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private LocalDate date;

    @Column
    private String description;

    @Column(nullable = false)
    private int year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private HolidayType type = HolidayType.MANDATORY;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.date != null) {
            this.year = this.date.getYear();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}