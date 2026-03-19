package com.revworkforce.admin.service;

import com.revworkforce.admin.dto.request.DepartmentRequest;
import com.revworkforce.admin.entity.Department;
import com.revworkforce.admin.repository.DepartmentRepository;
import com.revworkforce.admin.serviceImpl.DepartmentServiceImpl;
import com.revworkforce.common.exception.DuplicateResourceException;
import com.revworkforce.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private DepartmentServiceImpl departmentService;

    private DepartmentRequest validRequest;
    private Department savedDepartment;

    @BeforeEach
    void setUp() {
        validRequest = DepartmentRequest.builder()
                .name("Engineering")
                .description("Software Engineering Department")
                .build();

        savedDepartment = Department.builder()
                .departmentId(1L)
                .name("Engineering")
                .description("Software Engineering Department")
                .active(true)
                .build();
    }

    @Test
    void createDepartment_Success() {
        when(departmentRepository.existsByNameIgnoreCase("Engineering")).thenReturn(false);
        when(departmentRepository.save(any(Department.class))).thenReturn(savedDepartment);
        when(activityLogService.log(any(), any(), any(), any(), any())).thenReturn(null);

        Department result = departmentService.createDepartment(validRequest, 1L);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Engineering");
        verify(departmentRepository, times(1)).save(any(Department.class));
    }

    @Test
    void createDepartment_DuplicateName_ThrowsException() {
        when(departmentRepository.existsByNameIgnoreCase("Engineering")).thenReturn(true);

        assertThatThrownBy(() -> departmentService.createDepartment(validRequest, 1L))
                .isInstanceOf(DuplicateResourceException.class);

        verify(departmentRepository, never()).save(any());
    }

    @Test
    void getDepartmentById_NotFound_ThrowsException() {
        when(departmentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> departmentService.getDepartmentById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getDepartmentById_Found_ReturnsDepartment() {
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(savedDepartment));

        Department result = departmentService.getDepartmentById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getDepartmentId()).isEqualTo(1L);
    }

    @Test
    void deleteDepartment_Success_SetsInactive() {
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(savedDepartment));
        when(departmentRepository.save(any(Department.class))).thenReturn(savedDepartment);
        when(activityLogService.log(any(), any(), any(), any(), any())).thenReturn(null);

        departmentService.deleteDepartment(1L, 1L);

        verify(departmentRepository, times(1)).save(argThat(d -> !d.isActive()));
    }

    @Test
    void updateDepartment_NotFound_ThrowsException() {
        when(departmentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> departmentService.updateDepartment(99L, validRequest, 1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
