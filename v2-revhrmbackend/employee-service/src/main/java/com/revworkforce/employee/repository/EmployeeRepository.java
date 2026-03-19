package com.revworkforce.employee.repository;

import com.revworkforce.common.enums.EmployeeStatus;
import com.revworkforce.common.enums.Role;
import com.revworkforce.employee.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByEmpCode(String empCode);
    boolean existsByEmail(String email);
    boolean existsByEmpCode(String empCode);
    List<Employee> findByManagerId(Long managerId);
    List<Employee> findByDepartmentIdAndRole(Long departmentId, Role role);
    long countByStatus(EmployeeStatus status);
    long countByRole(Role role);
    long countByDepartmentId(Long departmentId);

    @Query("SELECT e FROM Employee e WHERE e.managerId = :managerId AND e.status = 'ACTIVE'")
    List<Employee> findActiveByManagerId(@Param("managerId") Long managerId);

    @Query("SELECT e FROM Employee e WHERE " +
            "(:search IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(e.empCode) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:departmentId IS NULL OR e.departmentId = :departmentId) " +
            "AND (:status IS NULL OR e.status = :status)")
    Page<Employee> searchEmployees(
            @Param("search") String search,
            @Param("departmentId") Long departmentId,
            @Param("status") EmployeeStatus status,
            Pageable pageable);

    @Query("SELECT e.departmentName, COUNT(e) FROM Employee e WHERE e.status = 'ACTIVE' GROUP BY e.departmentName")
    List<Object[]> countByDepartmentGrouped();

    @Query("SELECT e FROM Employee e WHERE e.status = 'ACTIVE' " +
            "AND (:search IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(e.empCode) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(e.departmentName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Employee> searchDirectory(@Param("search") String search, Pageable pageable);


}