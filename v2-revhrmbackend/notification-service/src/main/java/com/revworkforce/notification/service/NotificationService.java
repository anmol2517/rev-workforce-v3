package com.revworkforce.notification.service;

import com.revworkforce.common.dto.NotificationRequest;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.notification.entity.Notification;

public interface NotificationService {
    Notification sendNotification(NotificationRequest request);
    void broadcastNotification(NotificationRequest request);
    PageResponse<Notification> getMyNotifications(Long userId, int page, int size);
    PageResponse<Notification> getUnreadNotifications(Long userId, int page, int size);
    Notification markAsRead(Long notificationId, Long userId);
    int markAllAsRead(Long userId);
    long countUnread(Long userId);
}
