package com.revworkforce.employee.entity;

import com.revworkforce.common.enums.EmployeeStatus;
import com.revworkforce.common.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    // FIX: Changed from IDENTITY to SEQUENCE so we can provide an explicit PK (authUserId).
    // MySQL IDENTITY ignores any manually set ID — so we switch to SEQUENCE strategy.
    // allocationSize=1 ensures no ID gaps/batching.
    // In EmployeeServiceImpl.createEmployee(), when request.getUserId() != null,
    // we set it on the entity before save — Hibernate respects it with SEQUENCE strategy.
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employee_seq")
    @SequenceGenerator(name = "employee_seq", sequenceName = "employee_id_seq", allocationSize = 1)
    private Long employeeId;

    // userId from auth-service — kept in sync so employeeId == userId always
    @Column(unique = true)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String empCode;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false)
    private Long departmentId;

    @Column
    private String departmentName;

    @Column(nullable = false)
    private Long designationId;

    @Column
    private String designationName;

    @Column
    private Long managerId;

    @Column
    private String managerName;

    @Column(nullable = false)
    private LocalDate joiningDate;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal salary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EmployeeStatus status = EmployeeStatus.ACTIVE;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}