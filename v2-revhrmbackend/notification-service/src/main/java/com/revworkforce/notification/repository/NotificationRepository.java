package com.revworkforce.notification.repository;

import com.revworkforce.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE (n.recipientUserId = :userId OR n.recipientUserId = 0) ORDER BY n.createdAt DESC")
    Page<Notification> findByRecipientUserIdOrBroadcast(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE (n.recipientUserId = :userId OR n.recipientUserId = 0) AND n.read = false ORDER BY n.createdAt DESC")
    Page<Notification> findUnreadByRecipientUserIdOrBroadcast(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT COUNT(n) FROM Notification n WHERE (n.recipientUserId = :userId OR n.recipientUserId = 0) AND n.read = false")
    long countUnreadByUserIdOrBroadcast(@Param("userId") Long userId);

    long countByRecipientUserIdAndRead(Long recipientUserId, boolean read);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true, n.readAt = CURRENT_TIMESTAMP WHERE (n.recipientUserId = :userId OR n.recipientUserId = 0) AND n.read = false")
    int markAllAsRead(@Param("userId") Long userId);
}
