package com.revworkforce.admin.serviceImpl;

import com.revworkforce.admin.dto.request.HolidayRequest;
import com.revworkforce.admin.entity.Holiday;
import com.revworkforce.admin.repository.HolidayRepository;
import com.revworkforce.admin.service.ActivityLogService;
import com.revworkforce.admin.service.HolidayService;
import com.revworkforce.common.exception.BadRequestException;
import com.revworkforce.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class HolidayServiceImpl implements HolidayService {

    private final HolidayRepository holidayRepository;
    private final ActivityLogService activityLogService;

    @Override
    @Transactional
    public Holiday createHoliday(HolidayRequest request, Long adminUserId) {
        if (holidayRepository.existsByDate(request.getDate())) {
            throw new BadRequestException("A holiday already exists on date: " + request.getDate());
        }
        Holiday holiday = Holiday.builder()
                .name(request.getName())
                .date(request.getDate())
                .description(request.getDescription())
                .year(request.getDate().getYear())
                .type(request.getType())
                .build();
        Holiday saved = holidayRepository.save(holiday);
        activityLogService.log(adminUserId, "CREATE", "HOLIDAY", saved.getHolidayId(),
                "Created holiday: " + saved.getName() + " on " + saved.getDate());
        return saved;
    }

    @Override
    @Transactional
    public Holiday updateHoliday(Long holidayId, HolidayRequest request, Long adminUserId) {
        Holiday holiday = holidayRepository.findById(holidayId)
                .orElseThrow(() -> new ResourceNotFoundException("Holiday", "id", holidayId));
        if (!holiday.getDate().equals(request.getDate())
                && holidayRepository.existsByDate(request.getDate())) {
            throw new BadRequestException("A holiday already exists on date: " + request.getDate());
        }
        holiday.setName(request.getName());
        holiday.setDate(request.getDate());
        holiday.setDescription(request.getDescription());
        holiday.setYear(request.getDate().getYear());
        holiday.setType(request.getType());
        Holiday saved = holidayRepository.save(holiday);
        activityLogService.log(adminUserId, "UPDATE", "HOLIDAY", saved.getHolidayId(),
                "Updated holiday: " + saved.getName());
        return saved;
    }

    @Override
    @Transactional
    public List<Holiday> createHolidaysBulk(List<HolidayRequest> requests, Long adminUserId) {
        List<Holiday> created = new ArrayList<>();
        for (HolidayRequest req : requests) {
            Holiday h = Holiday.builder()
                    .name(req.getName())
                    .date(req.getDate())
                    .type(req.getType())
                    .description(req.getDescription())
                    .build();
            Holiday saved = holidayRepository.save(h);
            activityLogService.log(adminUserId, "CREATE", "HOLIDAY", saved.getHolidayId(),
                    "Bulk created: " + saved.getName());
            created.add(saved);
        }
        return created;
    }

    @Override
    @Transactional
    public void deleteHoliday(Long holidayId, Long adminUserId) {
        Holiday holiday = holidayRepository.findById(holidayId)
                .orElseThrow(() -> new ResourceNotFoundException("Holiday", "id", holidayId));
        holidayRepository.deleteById(holidayId);
        activityLogService.log(adminUserId, "DELETE", "HOLIDAY", holidayId,
                "Deleted holiday: " + holiday.getName());
    }

    @Override
    public Holiday getHolidayById(Long holidayId) {
        return holidayRepository.findById(holidayId)
                .orElseThrow(() -> new ResourceNotFoundException("Holiday", "id", holidayId));
    }

    @Override
    public List<Holiday> getHolidaysByYear(int year) {
        return holidayRepository.findByYearOrderByDateAsc(year);
    }

    @Override
    public List<Holiday> getAllHolidays() {
        return holidayRepository.findAllByOrderByDateAsc();
    }
}
