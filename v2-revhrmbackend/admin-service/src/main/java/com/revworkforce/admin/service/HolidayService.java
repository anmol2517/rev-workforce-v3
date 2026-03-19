package com.revworkforce.admin.service;

import com.revworkforce.admin.dto.request.HolidayRequest;
import com.revworkforce.admin.entity.Holiday;

import java.util.List;

public interface HolidayService {
    Holiday createHoliday(HolidayRequest request, Long adminUserId);
    Holiday updateHoliday(Long holidayId, HolidayRequest request, Long adminUserId);
    void deleteHoliday(Long holidayId, Long adminUserId);
    Holiday getHolidayById(Long holidayId);
    List<Holiday> getHolidaysByYear(int year);
    List<Holiday> getAllHolidays();
    List<Holiday> createHolidaysBulk(List<HolidayRequest> requests, Long adminUserId);
}
