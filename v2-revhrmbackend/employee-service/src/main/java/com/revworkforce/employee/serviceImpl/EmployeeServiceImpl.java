package com.revworkforce.employee.serviceImpl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revworkforce.common.dto.EmployeeDTO;
import com.revworkforce.common.dto.EmployeeReportDTO;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.common.enums.EmployeeStatus;
import com.revworkforce.common.enums.Role;
import com.revworkforce.common.exception.DuplicateResourceException;
import com.revworkforce.common.exception.ResourceNotFoundException;
import com.revworkforce.employee.config.EmployeeMapper;
import com.revworkforce.employee.dto.request.InternalCreateEmployeeRequest;
import com.revworkforce.employee.dto.request.UpdateProfileRequest;
import com.revworkforce.employee.entity.Employee;
import com.revworkforce.employee.repository.EmployeeRepository;
import com.revworkforce.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private final ObjectMapper objectMapper;

    private String generateEmpCode(Role role) {
        long count = employeeRepository.count() + 1;
        String formatted = String.format("%03d", count);
        return switch (role) {
            case ADMIN -> "SYSAD-" + formatted;
            case MANAGER -> "MGR-" + formatted;
            default -> "EMP-" + formatted;
        };
    }

    @Override
    @Transactional
    public EmployeeDTO createEmployee(InternalCreateEmployeeRequest request) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Employee", "email", request.getEmail());
        }

        String empCode = (request.getEmpCode() == null || request.getEmpCode().isBlank())
                ? generateEmpCode(request.getRole())
                : request.getEmpCode();

        int attempt = 0;
        while (employeeRepository.existsByEmpCode(empCode) && attempt < 100) {
            attempt++;
            long count = employeeRepository.count() + attempt;
            String formatted = String.format("%03d", count);
            empCode = switch (request.getRole()) {
                case ADMIN -> "SYSAD-" + formatted;
                case MANAGER -> "MGR-" + formatted;
                default -> "EMP-" + formatted;
            };
        }

        Long managerId = request.getManagerId();
        String managerName = request.getManagerName();
        if (request.getRole() == Role.EMPLOYEE && managerId == null) {
            List<Employee> deptManagers = employeeRepository.findByDepartmentIdAndRole(
                    request.getDepartmentId(), Role.MANAGER);
            if (deptManagers.size() == 1) {
                managerId = deptManagers.get(0).getEmployeeId();
                managerName = deptManagers.get(0).getFirstName() + " " + deptManagers.get(0).getLastName();
            }
        }
        if (request.getRole() == Role.MANAGER) {
            managerId = null;
            managerName = null;
        }

        Employee.EmployeeBuilder builder = Employee.builder()
                .empCode(empCode)
                .userId(request.getUserId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .departmentId(request.getDepartmentId())
                .departmentName(request.getDepartmentName())
                .designationId(request.getDesignationId())
                .designationName(request.getDesignationName())
                .managerId(managerId)
                .managerName(managerName)
                .joiningDate(request.getJoiningDate())
                .salary(request.getSalary())
                .role(request.getRole())
                .status(EmployeeStatus.ACTIVE);

        // FIX: If userId provided from auth-service, force it as the PK.
        // This ensures auth.userId == employee.employeeId — critical for identity lookup.
        if (request.getUserId() != null) {
            builder.employeeId(request.getUserId());
        }

        Employee saved = employeeRepository.save(builder.build());
        log.info("Employee created: {} - {}", saved.getEmpCode(), saved.getEmail());
        return employeeMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public EmployeeDTO updateEmployee(Long employeeId, Object request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));
        Map<String, Object> updates = objectMapper.convertValue(request, Map.class);
        if (updates.get("firstName") != null) employee.setFirstName((String) updates.get("firstName"));
        if (updates.get("lastName") != null) employee.setLastName((String) updates.get("lastName"));
        if (updates.get("phone") != null) employee.setPhone((String) updates.get("phone"));
        if (updates.get("address") != null) employee.setAddress((String) updates.get("address"));
        if (updates.get("departmentId") != null) employee.setDepartmentId(Long.valueOf(updates.get("departmentId").toString()));
        if (updates.get("departmentName") != null) employee.setDepartmentName((String) updates.get("departmentName"));
        if (updates.get("designationId") != null) employee.setDesignationId(Long.valueOf(updates.get("designationId").toString()));
        if (updates.get("designationName") != null) employee.setDesignationName((String) updates.get("designationName"));
        if (updates.get("managerId") != null) employee.setManagerId(Long.valueOf(updates.get("managerId").toString()));
        if (updates.get("managerName") != null) employee.setManagerName((String) updates.get("managerName"));
        if (updates.get("salary") != null) employee.setSalary(new java.math.BigDecimal(updates.get("salary").toString()));
        if (updates.get("role") != null) employee.setRole(Role.valueOf(updates.get("role").toString()));
        return employeeMapper.toDTO(employeeRepository.save(employee));
    }

    @Override
    public EmployeeDTO getEmployeeById(Long employeeId) {
        return employeeMapper.toDTO(employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId)));
    }

    @Override
    public EmployeeDTO getEmployeeByUserId(Long userId) {
        return employeeMapper.toDTO(employeeRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", userId)));
    }

    @Override
    public EmployeeDTO getEmployeeByEmail(String email) {
        return employeeMapper.toDTO(employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "email", email)));
    }

    @Override
    public EmployeeDTO getMyProfile(Long userId) {
        return employeeMapper.toDTO(employeeRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + userId)));
    }

    @Override
    @Transactional
    public EmployeeDTO updateMyProfile(Long userId, UpdateProfileRequest request) {
        Employee employee = employeeRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
        if (request.getPhone() != null) employee.setPhone(request.getPhone());
        if (request.getAddress() != null) employee.setAddress(request.getAddress());
        return employeeMapper.toDTO(employeeRepository.save(employee));
    }

    @Override
    public PageResponse<EmployeeDTO> getAllEmployees(int page, int size, String search,
                                                     Long departmentId, String status) {
        EmployeeStatus employeeStatus = null;
        if (status != null && !status.isBlank()) {
            try { employeeStatus = EmployeeStatus.valueOf(status.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }
        PageRequest pageable = PageRequest.of(page, size, Sort.by("firstName").ascending());
        Page<Employee> employeePage = employeeRepository.searchEmployees(
                (search == null || search.isBlank()) ? null : search,
                departmentId, employeeStatus, pageable);
        return PageResponse.of(employeePage.map(employeeMapper::toDTO));
    }

    @Override
    public PageResponse<EmployeeDTO> getDirectory(int page, int size, String search) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("firstName").ascending());
        Page<Employee> result = employeeRepository.searchDirectory(
                (search == null || search.isBlank()) ? null : search, pageable);
        return PageResponse.of(result.map(employeeMapper::toDTO));
    }

    @Override
    @Transactional
    public void deactivateEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));
        employee.setStatus(EmployeeStatus.INACTIVE);
        employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public void activateEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));
        employee.setStatus(EmployeeStatus.ACTIVE);
        employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public EmployeeDTO assignManager(Long employeeId, Long managerId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));
        Employee manager = employeeRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager", "id", managerId));
        employee.setManagerId(managerId);
        employee.setManagerName(manager.getFirstName() + " " + manager.getLastName());
        return employeeMapper.toDTO(employeeRepository.save(employee));
    }

    @Override
    public List<EmployeeDTO> getTeamByManager(Long managerId) {
        return employeeRepository.findActiveByManagerId(managerId)
                .stream().map(employeeMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<EmployeeDTO> getDirectReportees(Long managerId) {
        return getTeamByManager(managerId);
    }

    @Override
    public List<EmployeeDTO> getManagersByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentIdAndRole(departmentId, Role.MANAGER)
                .stream()
                .filter(e -> e.getStatus() == EmployeeStatus.ACTIVE)
                .map(employeeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Long countEmployees(String status) {
        if (status == null || status.isBlank()) return employeeRepository.count();
        if ("MANAGER".equalsIgnoreCase(status)) return employeeRepository.countByRole(Role.MANAGER);
        try { return employeeRepository.countByStatus(EmployeeStatus.valueOf(status.toUpperCase())); }
        catch (IllegalArgumentException e) { return employeeRepository.count(); }
    }

    @Override
    public Long countByDepartment(Long departmentId) {
        return employeeRepository.countByDepartmentId(departmentId);
    }

    @Override
    public Map<String, Long> getEmployeeStatsByDepartment() {
        Map<String, Long> stats = new HashMap<>();
        employeeRepository.countByDepartmentGrouped()
                .forEach(row -> stats.put((String) row[0], (Long) row[1]));
        return stats;
    }

    @Override
    public EmployeeReportDTO getEmployeeReport(Long userId) {
        Employee emp = employeeRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
        List<Employee> teamMembers = employeeRepository.findByManagerId(emp.getEmployeeId());
        List<String> teamNames = teamMembers.stream()
                .map(e -> e.getFirstName() + " " + e.getLastName())
                .collect(Collectors.toList());
        return EmployeeReportDTO.builder()
                .empCode(emp.getEmpCode())
                .firstName(emp.getFirstName())
                .lastName(emp.getLastName())
                .email(emp.getEmail())
                .phone(emp.getPhone())
                .address(emp.getAddress())
                .departmentName(emp.getDepartmentName())
                .designationName(emp.getDesignationName())
                .managerName(emp.getManagerName())
                .role(emp.getRole() != null ? emp.getRole().name() : "")
                .status(emp.getStatus() != null ? emp.getStatus().name() : "")
                .joiningDate(emp.getJoiningDate())
                .salary(emp.getSalary())
                .teamSize(teamMembers.size())
                .teamMemberNames(teamNames)
                .build();
    }
}