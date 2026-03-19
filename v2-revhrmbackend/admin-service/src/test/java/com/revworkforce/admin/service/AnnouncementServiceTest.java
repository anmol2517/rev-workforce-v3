package com.revworkforce.admin.service;

import com.revworkforce.admin.client.NotificationClient;
import com.revworkforce.admin.dto.request.AnnouncementRequest;
import com.revworkforce.admin.entity.Announcement;
import com.revworkforce.admin.repository.AnnouncementRepository;
import com.revworkforce.admin.serviceImpl.AnnouncementServiceImpl;
import com.revworkforce.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnnouncementServiceTest {

    @Mock
    private AnnouncementRepository announcementRepository;

    @Mock
    private ActivityLogService activityLogService;

    @Mock
    private NotificationClient notificationClient;

    @InjectMocks
    private AnnouncementServiceImpl announcementService;

    private AnnouncementRequest validRequest;
    private Announcement savedAnnouncement;

    @BeforeEach
    void setUp() {
        validRequest = AnnouncementRequest.builder()
                .title("Company Holiday")
                .content("Office will be closed on Friday")
                .build();

        savedAnnouncement = Announcement.builder()
                .announcementId(1L)
                .title("Company Holiday")
                .content("Office will be closed on Friday")
                .createdBy(1L)
                .active(true)
                .build();
    }

    @Test
    void createAnnouncement_Success() {
        when(announcementRepository.save(any(Announcement.class))).thenReturn(savedAnnouncement);
        when(activityLogService.log(any(), any(), any(), any(), any())).thenReturn(null);
        when(notificationClient.broadcastNotification(any())).thenReturn(null);

        Announcement result = announcementService.createAnnouncement(validRequest, 1L);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Company Holiday");
        verify(announcementRepository, times(1)).save(any(Announcement.class));
    }

    @Test
    void getAnnouncementById_NotFound_ThrowsException() {
        when(announcementRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> announcementService.getAnnouncementById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteAnnouncement_Success_SetsInactive() {
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(savedAnnouncement));
        when(announcementRepository.save(any(Announcement.class))).thenReturn(savedAnnouncement);
        when(activityLogService.log(any(), any(), any(), any(), any())).thenReturn(null);

        announcementService.deleteAnnouncement(1L, 1L);

        verify(announcementRepository, times(1)).save(argThat(a -> !a.isActive()));
    }

    @Test
    void updateAnnouncement_Success() {
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(savedAnnouncement));
        when(announcementRepository.save(any(Announcement.class))).thenReturn(savedAnnouncement);
        when(activityLogService.log(any(), any(), any(), any(), any())).thenReturn(null);

        Announcement result = announcementService.updateAnnouncement(1L, validRequest, 1L);

        assertThat(result).isNotNull();
        verify(announcementRepository, times(1)).save(any(Announcement.class));
    }
}
