package com.revworkforce.admin.serviceImpl;

import com.revworkforce.admin.dto.request.DepartmentRequest;
import com.revworkforce.admin.dto.response.BulkDepartmentResponse;
import com.revworkforce.admin.entity.Department;
import com.revworkforce.admin.repository.DepartmentRepository;
import com.revworkforce.admin.service.ActivityLogService;
import com.revworkforce.admin.service.DepartmentService;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.common.exception.DuplicateResourceException;
import com.revworkforce.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final ActivityLogService activityLogService;

    @Override
    @Transactional
    public Department createDepartment(DepartmentRequest request, Long adminUserId) {
        if (departmentRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("Department", "name", request.getName());
        }
        Department department = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();
        Department saved = departmentRepository.save(department);
        activityLogService.log(adminUserId, "CREATE", "DEPARTMENT", saved.getDepartmentId(),
                "Created department: " + saved.getName());
        log.info("Department created: {}", saved.getName());
        return saved;
    }

    @Override
    @Transactional
    public Department updateDepartment(Long departmentId, DepartmentRequest request, Long adminUserId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", departmentId));
        if (!department.getName().equalsIgnoreCase(request.getName())
                && departmentRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("Department", "name", request.getName());
        }
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        Department saved = departmentRepository.save(department);
        activityLogService.log(adminUserId, "UPDATE", "DEPARTMENT", saved.getDepartmentId(),
                "Updated department: " + saved.getName());
        return saved;
    }

    @Override
    @Transactional
    public void deleteDepartment(Long departmentId, Long adminUserId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", departmentId));
        department.setActive(false);
        departmentRepository.save(department);
        activityLogService.log(adminUserId, "DELETE", "DEPARTMENT", departmentId,
                "Deactivated department: " + department.getName());
        log.info("Department deactivated: {}", departmentId);
    }

    @Override
    public Department getDepartmentById(Long departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", departmentId));
    }

    @Override
    public PageResponse<Department> getAllDepartments(int page, int size, boolean activeOnly) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Department> departments = activeOnly
                ? departmentRepository.findByActive(true, pageable)
                : departmentRepository.findAll(pageable);
        return PageResponse.of(departments);
    }

    @Override
    @Transactional
    public BulkDepartmentResponse createDepartmentsBulk(List<DepartmentRequest> requests, Long adminUserId) {
        List<Department> created = new ArrayList<>();
        List<String> skipped = new ArrayList<>();

        for (DepartmentRequest req : requests) {
            if (departmentRepository.existsByNameIgnoreCase(req.getName())) {
                skipped.add(req.getName());
                continue;
            }
            Department department = Department.builder()
                    .name(req.getName())
                    .description(req.getDescription())
                    .active(true)
                    .build();

            Department saved = departmentRepository.save(department);
            activityLogService.log(adminUserId, "CREATE", "DEPARTMENT", saved.getDepartmentId(),
                    "Bulk created department: " + saved.getName());
            created.add(saved);
        }

        return BulkDepartmentResponse.builder()
                .totalRequested(requests.size())
                .totalCreated(created.size())
                .totalSkipped(skipped.size())
                .created(created)
                .skipped(skipped)
                .build();
    }
}