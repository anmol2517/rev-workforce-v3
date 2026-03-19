package com.revworkforce.admin.controller;

import com.revworkforce.admin.dto.request.AnnouncementRequest;
import com.revworkforce.admin.entity.Announcement;
import com.revworkforce.admin.security.RequestContext;
import com.revworkforce.admin.service.AnnouncementService;
import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/admin/announcements")
@RequiredArgsConstructor
@Tag(name = "Announcement Management", description = "Create and manage company announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final RequestContext requestContext;

    @PostMapping
    @Operation(summary = "Create announcement")
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(
            @Valid @RequestBody AnnouncementRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        Announcement announcement = announcementService.createAnnouncement(request, adminUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(announcement, "Announcement created successfully"));
    }

    @GetMapping
    @Operation(summary = "Get all announcements (admin)")
    public ResponseEntity<ApiResponse<PageResponse<Announcement>>> getAllAnnouncements(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<Announcement> response = announcementService.getAllAnnouncements(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active announcements (for all employees)")
    public ResponseEntity<ApiResponse<PageResponse<Announcement>>> getActiveAnnouncements(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<Announcement> response = announcementService.getActiveAnnouncements(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{announcementId}")
    @Operation(summary = "Get announcement by ID")
    public ResponseEntity<ApiResponse<Announcement>> getAnnouncementById(
            @PathVariable Long announcementId) {
        Announcement announcement = announcementService.getAnnouncementById(announcementId);
        return ResponseEntity.ok(ApiResponse.success(announcement));
    }

    @PutMapping("/{announcementId}")
    @Operation(summary = "Update announcement")
    public ResponseEntity<ApiResponse<Announcement>> updateAnnouncement(
            @PathVariable Long announcementId,
            @Valid @RequestBody AnnouncementRequest request) {
        Long adminUserId = requestContext.getCurrentUserId();
        Announcement announcement = announcementService.updateAnnouncement(announcementId, request, adminUserId);
        return ResponseEntity.ok(ApiResponse.success(announcement, "Announcement updated successfully"));
    }

    @DeleteMapping("/{announcementId}")
    @Operation(summary = "Delete announcement")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(@PathVariable Long announcementId) {
        Long adminUserId = requestContext.getCurrentUserId();
        announcementService.deleteAnnouncement(announcementId, adminUserId);
        return ResponseEntity.ok(ApiResponse.success("Announcement deleted successfully"));
    }
}
