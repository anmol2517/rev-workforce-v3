package com.revworkforce.admin.service;

import com.revworkforce.admin.dto.request.HolidayRequest;
import com.revworkforce.admin.entity.Holiday;
import com.revworkforce.admin.repository.HolidayRepository;
import com.revworkforce.admin.serviceImpl.HolidayServiceImpl;
import com.revworkforce.common.exception.BadRequestException;
import com.revworkforce.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HolidayServiceTest {

    @Mock
    private HolidayRepository holidayRepository;

    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private HolidayServiceImpl holidayService;

    private HolidayRequest validRequest;
    private Holiday savedHoliday;

    @BeforeEach
    void setUp() {
        validRequest = HolidayRequest.builder()
                .name("Republic Day")
                .date(LocalDate.of(2025, 1, 26))
                .description("National Holiday")
                .build();

        savedHoliday = Holiday.builder()
                .holidayId(1L)
                .name("Republic Day")
                .date(LocalDate.of(2025, 1, 26))
                .year(2025)
                .build();
    }

    @Test
    void createHoliday_Success() {
        when(holidayRepository.existsByDate(any())).thenReturn(false);
        when(holidayRepository.save(any(Holiday.class))).thenReturn(savedHoliday);
        when(activityLogService.log(any(), any(), any(), any(), any())).thenReturn(null);

        Holiday result = holidayService.createHoliday(validRequest, 1L);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Republic Day");
    }

    @Test
    void createHoliday_DateConflict_ThrowsException() {
        when(holidayRepository.existsByDate(any())).thenReturn(true);

        assertThatThrownBy(() -> holidayService.createHoliday(validRequest, 1L))
                .isInstanceOf(BadRequestException.class);

        verify(holidayRepository, never()).save(any());
    }

    @Test
    void getHolidaysByYear_ReturnsList() {
        when(holidayRepository.findByYearOrderByDateAsc(2025)).thenReturn(List.of(savedHoliday));

        List<Holiday> result = holidayService.getHolidaysByYear(2025);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Republic Day");
    }

    @Test
    void deleteHoliday_NotFound_ThrowsException() {
        when(holidayRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> holidayService.deleteHoliday(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
