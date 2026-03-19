package com.revworkforce.notification.service;

import com.revworkforce.common.dto.NotificationRequest;
import com.revworkforce.common.enums.NotificationType;
import com.revworkforce.common.exception.UnauthorizedException;
import com.revworkforce.notification.entity.Notification;
import com.revworkforce.notification.repository.NotificationRepository;
import com.revworkforce.notification.serviceImpl.NotificationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private NotificationRequest validRequest;
    private Notification savedNotification;

    @BeforeEach
    void setUp() {
        validRequest = NotificationRequest.builder()
                .recipientUserId(1L)
                .title("Leave Approved")
                .message("Your leave has been approved")
                .type(NotificationType.LEAVE_APPROVED)
                .referenceId("1")
                .referenceType("LEAVE")
                .build();

        savedNotification = Notification.builder()
                .notificationId(1L)
                .recipientUserId(1L)
                .title("Leave Approved")
                .message("Your leave has been approved")
                .type(NotificationType.LEAVE_APPROVED)
                .read(false)
                .build();
    }

    @Test
    void sendNotification_Success() {
        when(notificationRepository.save(any(Notification.class))).thenReturn(savedNotification);

        Notification result = notificationService.sendNotification(validRequest);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Leave Approved");
        assertThat(result.isRead()).isFalse();
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void markAsRead_NotOwner_ThrowsUnauthorized() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(savedNotification));

        assertThatThrownBy(() -> notificationService.markAsRead(1L, 99L))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void markAsRead_Success() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(savedNotification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(savedNotification);

        Notification result = notificationService.markAsRead(1L, 1L);

        verify(notificationRepository).save(argThat(n -> n.isRead()));
    }

    @Test
    void countUnread_ReturnsCount() {
        when(notificationRepository.countUnreadByUserIdOrBroadcast(1L)).thenReturn(5L);

        long count = notificationService.countUnread(1L);

        assertThat(count).isEqualTo(5L);
    }

    @Test
    void markAllAsRead_ReturnsCount() {
        when(notificationRepository.markAllAsRead(1L)).thenReturn(3);

        int count = notificationService.markAllAsRead(1L);

        assertThat(count).isEqualTo(3);
    }
}
