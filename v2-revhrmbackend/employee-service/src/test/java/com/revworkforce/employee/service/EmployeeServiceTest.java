package com.revworkforce.employee.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.revworkforce.common.dto.EmployeeDTO;
import com.revworkforce.common.enums.EmployeeStatus;
import com.revworkforce.common.enums.Role;
import com.revworkforce.common.exception.DuplicateResourceException;
import com.revworkforce.common.exception.ResourceNotFoundException;
import com.revworkforce.employee.config.EmployeeMapper;
import com.revworkforce.employee.dto.request.InternalCreateEmployeeRequest;
import com.revworkforce.employee.entity.Employee;
import com.revworkforce.employee.repository.EmployeeRepository;
import com.revworkforce.employee.serviceImpl.EmployeeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Spy
    private EmployeeMapper employeeMapper;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private InternalCreateEmployeeRequest createRequest;
    private Employee savedEmployee;

    @BeforeEach
    void setUp() {
        createRequest = InternalCreateEmployeeRequest.builder()
                .firstName("John").lastName("Doe").email("john@test.com")
                .empCode("EMP001").departmentId(1L).designationId(1L)
                .joiningDate(LocalDate.now()).salary(BigDecimal.valueOf(50000))
                .role(Role.EMPLOYEE).userId(1L).build();

        savedEmployee = Employee.builder()
                .employeeId(1L).empCode("EMP001").firstName("John").lastName("Doe")
                .email("john@test.com").departmentId(1L).designationId(1L)
                .joiningDate(LocalDate.now()).salary(BigDecimal.valueOf(50000))
                .role(Role.EMPLOYEE).status(EmployeeStatus.ACTIVE).userId(1L).build();
    }

    @Test
    void createEmployee_Success() {
        when(employeeRepository.existsByEmail("john@test.com")).thenReturn(false);
        when(employeeRepository.existsByEmpCode("EMP001")).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenReturn(savedEmployee);

        EmployeeDTO result = employeeService.createEmployee(createRequest);

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("john@test.com");
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    void createEmployee_DuplicateEmail_ThrowsException() {
        when(employeeRepository.existsByEmail("john@test.com")).thenReturn(true);

        assertThatThrownBy(() -> employeeService.createEmployee(createRequest))
                .isInstanceOf(DuplicateResourceException.class);

        verify(employeeRepository, never()).save(any());
    }

    @Test
    void getEmployeeById_NotFound_ThrowsException() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.getEmployeeById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deactivateEmployee_Success() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(savedEmployee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(savedEmployee);

        employeeService.deactivateEmployee(1L);

        verify(employeeRepository).save(argThat(e -> e.getStatus() == EmployeeStatus.INACTIVE));
    }

    @Test
    void countEmployees_ReturnsTotal() {
        when(employeeRepository.count()).thenReturn(10L);

        Long count = employeeService.countEmployees(null);

        assertThat(count).isEqualTo(10L);
    }
}
