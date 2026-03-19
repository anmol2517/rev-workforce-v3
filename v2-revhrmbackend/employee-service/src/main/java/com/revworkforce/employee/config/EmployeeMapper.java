package com.revworkforce.employee.config;

import com.revworkforce.common.dto.EmployeeDTO;
import com.revworkforce.employee.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeDTO toDTO(Employee employee) {
        if (employee == null) return null;
        return EmployeeDTO.builder()
                .employeeId(employee.getEmployeeId())
                .empCode(employee.getEmpCode())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .address(employee.getAddress())
                .departmentId(employee.getDepartmentId())
                .departmentName(employee.getDepartmentName())
                .designationId(employee.getDesignationId())
                .designationName(employee.getDesignationName())
                .managerId(employee.getManagerId())
                .managerName(employee.getManagerName())
                .joiningDate(employee.getJoiningDate())
                .salary(employee.getSalary())
                .role(employee.getRole())
                .status(employee.getStatus())
                .build();
    }
}
