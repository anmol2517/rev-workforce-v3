package com.revworkforce.admin.repository;

import com.revworkforce.admin.entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    List<Holiday> findByYearOrderByDateAsc(int year);
    boolean existsByDate(LocalDate date);
    List<Holiday> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Holiday> findAllByOrderByDateAsc();
}
