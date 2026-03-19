package com.revworkforce.admin.controller;

import com.revworkforce.admin.dto.request.HolidayRequest;
import com.revworkforce.admin.entity.Holiday;
import com.revworkforce.admin.security.RequestContext;
import com.revworkforce.admin.service.HolidayService;
import com.revworkforce.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/holidays")
@RequiredArgsConstructor
@Tag(name = "Holiday Calendar Management", description = "Manage company holidays")
public class HolidayController {

    private final HolidayService holidayService;
    private final RequestContext requestContext;

    @PostMapping
    @Operation(summary = "Add a company holiday")
    public ResponseEntity<ApiResponse<Holiday>> createHoliday(
            @Valid @RequestBody HolidayRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        Holiday holiday = holidayService.createHoliday(request, adminUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(holiday, "Holiday added successfully"));
    }

    @PostMapping("/bulk")
    @Operation(summary = "Add multiple holidays")
    public ResponseEntity<ApiResponse<List<Holiday>>> createHolidaysBulk(
            @Valid @RequestBody List<HolidayRequest> requests) {
        Long adminUserId = requestContext.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        holidayService.createHolidaysBulk(requests, adminUserId),
                        "Holidays added"));
    }

    @GetMapping
    @Operation(summary = "Get all holidays")
    public ResponseEntity<ApiResponse<List<Holiday>>> getAllHolidays() {
        List<Holiday> holidays = holidayService.getAllHolidays();
        return ResponseEntity.ok(ApiResponse.success(holidays));
    }

    @GetMapping("/year/{year}")
    @Operation(summary = "Get holidays by year")
    public ResponseEntity<ApiResponse<List<Holiday>>> getHolidaysByYear(@PathVariable int year) {
        List<Holiday> holidays = holidayService.getHolidaysByYear(year);
        return ResponseEntity.ok(ApiResponse.success(holidays));
    }

    @GetMapping("/current-year")
    @Operation(summary = "Get holidays for current year")
    public ResponseEntity<ApiResponse<List<Holiday>>> getCurrentYearHolidays() {
        int currentYear = LocalDate.now().getYear();
        List<Holiday> holidays = holidayService.getHolidaysByYear(currentYear);
        return ResponseEntity.ok(ApiResponse.success(holidays));
    }

    @GetMapping("/{holidayId}")
    @Operation(summary = "Get holiday by ID")
    public ResponseEntity<ApiResponse<Holiday>> getHolidayById(@PathVariable Long holidayId) {
        Holiday holiday = holidayService.getHolidayById(holidayId);
        return ResponseEntity.ok(ApiResponse.success(holiday));
    }

    @PutMapping("/{holidayId}")
    @Operation(summary = "Update holiday")
    public ResponseEntity<ApiResponse<Holiday>> updateHoliday(
            @PathVariable Long holidayId,
            @Valid @RequestBody HolidayRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        Holiday holiday = holidayService.updateHoliday(holidayId, request, adminUserId);
        return ResponseEntity.ok(ApiResponse.success(holiday, "Holiday updated successfully"));
    }

    @DeleteMapping("/{holidayId}")
    @Operation(summary = "Delete holiday")
    public ResponseEntity<ApiResponse<Void>> deleteHoliday(@PathVariable Long holidayId) {
        Long adminUserId = requestContext.getCurrentUserId();
        holidayService.deleteHoliday(holidayId, adminUserId);
        return ResponseEntity.ok(ApiResponse.success("Holiday deleted successfully"));
    }
}
