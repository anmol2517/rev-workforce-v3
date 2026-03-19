package com.revworkforce.admin.serviceImpl;

import com.revworkforce.admin.dto.request.AnnouncementRequest;
import com.revworkforce.admin.entity.Announcement;
import com.revworkforce.admin.repository.AnnouncementRepository;
import com.revworkforce.admin.service.ActivityLogService;
import com.revworkforce.admin.service.AnnouncementService;
import com.revworkforce.admin.client.NotificationClient;
import com.revworkforce.common.dto.NotificationRequest;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.common.enums.NotificationType;
import com.revworkforce.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final ActivityLogService activityLogService;
    private final NotificationClient notificationClient;

    @Override
    @Transactional
    public Announcement createAnnouncement(AnnouncementRequest request, Long adminUserId) {
        Announcement announcement = Announcement.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .createdBy(adminUserId)
                .active(true)
                .publishedAt(LocalDateTime.now())
                .build();
        Announcement saved = announcementRepository.save(announcement);
        activityLogService.log(adminUserId, "CREATE", "ANNOUNCEMENT", saved.getAnnouncementId(),
                "Created announcement: " + saved.getTitle());
        try {
            notificationClient.broadcastNotification(NotificationRequest.builder()
                    .title("New Announcement: " + saved.getTitle())
                    .message(saved.getContent())
                    .type(NotificationType.ANNOUNCEMENT)
                    .referenceId(String.valueOf(saved.getAnnouncementId()))
                    .referenceType("ANNOUNCEMENT")
                    .build());
        } catch (Exception e) {
            log.warn("Failed to broadcast announcement notification: {}", e.getMessage());
        }
        log.info("Announcement created: {}", saved.getTitle());
        return saved;
    }

    @Override
    @Transactional
    public Announcement updateAnnouncement(Long announcementId, AnnouncementRequest request, Long adminUserId) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", announcementId));
        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        Announcement saved = announcementRepository.save(announcement);
        activityLogService.log(adminUserId, "UPDATE", "ANNOUNCEMENT", saved.getAnnouncementId(),
                "Updated announcement: " + saved.getTitle());
        return saved;
    }

    @Override
    @Transactional
    public void deleteAnnouncement(Long announcementId, Long adminUserId) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", announcementId));
        announcement.setActive(false);
        announcementRepository.save(announcement);
        activityLogService.log(adminUserId, "DELETE", "ANNOUNCEMENT", announcementId,
                "Deactivated announcement: " + announcement.getTitle());
        log.info("Announcement deactivated: {}", announcementId);
    }

    @Override
    public Announcement getAnnouncementById(Long announcementId) {
        return announcementRepository.findById(announcementId)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", announcementId));
    }

    @Override
    public PageResponse<Announcement> getAllAnnouncements(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Announcement> announcements = announcementRepository.findAll(pageable);
        return PageResponse.of(announcements);
    }

    @Override
    public PageResponse<Announcement> getActiveAnnouncements(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Announcement> announcements = announcementRepository.findByActive(true, pageable);
        return PageResponse.of(announcements);
    }
}
