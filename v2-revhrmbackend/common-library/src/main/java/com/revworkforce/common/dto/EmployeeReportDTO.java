package com.revworkforce.common.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeReportDTO {
    private String empCode;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String departmentName;
    private String designationName;
    private String managerName;
    private String role;
    private String status;
    private LocalDate joiningDate;
    private BigDecimal salary;
    private String emergencyContact;
    private String emergencyContactName;
    private int totalGoalsAssigned;
    private int goalsCompleted;
    private int goalsInProgress;
    private int goalsNotStarted;
    private int teamSize;
    private List<String> teamMemberNames;
}
