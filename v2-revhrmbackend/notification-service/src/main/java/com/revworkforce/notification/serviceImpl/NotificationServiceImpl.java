package com.revworkforce.notification.serviceImpl;

import com.revworkforce.common.dto.NotificationRequest;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.common.exception.ResourceNotFoundException;
import com.revworkforce.common.exception.UnauthorizedException;
import com.revworkforce.notification.entity.Notification;
import com.revworkforce.notification.repository.NotificationRepository;
import com.revworkforce.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public Notification sendNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .recipientUserId(request.getRecipientUserId())
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .referenceId(request.getReferenceId())
                .referenceType(request.getReferenceType())
                .read(false)
                .build();
        Notification saved = notificationRepository.save(notification);
        log.info("Notification sent to user: {} - {}", request.getRecipientUserId(), request.getTitle());
        return saved;
    }

    @Override
    @Transactional
    public void broadcastNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .recipientUserId(0L)
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .referenceId(request.getReferenceId())
                .referenceType(request.getReferenceType())
                .read(false)
                .build();
        notificationRepository.save(notification);
        log.info("Broadcast notification saved: {}", request.getTitle());
    }

    @Override
    public PageResponse<Notification> getMyNotifications(Long userId, int page, int size) {
        // FIX: userId null hone pe empty return karo
        if (userId == null) {
            return PageResponse.of(new PageImpl<>(
                    Collections.emptyList(), PageRequest.of(page, size), 0));
        }
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Notification> notifications = notificationRepository
                .findByRecipientUserIdOrBroadcast(userId, pageable);
        return PageResponse.of(notifications);
    }

    @Override
    public PageResponse<Notification> getUnreadNotifications(Long userId, int page, int size) {
        // FIX: userId null hone pe empty return karo
        if (userId == null) {
            return PageResponse.of(new PageImpl<>(
                    Collections.emptyList(), PageRequest.of(page, size), 0));
        }
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Notification> notifications = notificationRepository
                .findUnreadByRecipientUserIdOrBroadcast(userId, pageable);
        return PageResponse.of(notifications);
    }

    @Override
    @Transactional
    public Notification markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        if (!notification.getRecipientUserId().equals(userId)
                && !notification.getRecipientUserId().equals(0L)) {
            throw new UnauthorizedException("You can only mark your own notifications as read");
        }
        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public int markAllAsRead(Long userId) {
        if (userId == null) return 0;
        int updated = notificationRepository.markAllAsRead(userId);
        log.info("Marked {} notifications as read for user: {}", updated, userId);
        return updated;
    }

    @Override
    public long countUnread(Long userId) {
        if (userId == null) return 0L;
        return notificationRepository.countUnreadByUserIdOrBroadcast(userId);
    }
}