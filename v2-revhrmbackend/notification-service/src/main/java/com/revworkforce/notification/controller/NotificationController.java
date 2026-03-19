package com.revworkforce.notification.controller;

import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.NotificationRequest;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.notification.entity.Notification;
import com.revworkforce.notification.security.RequestContext;
import com.revworkforce.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "In-app notification management")
public class NotificationController {

    private final NotificationService notificationService;
    private final RequestContext requestContext;

    @GetMapping
    @Operation(summary = "Get my all notifications")
    public ResponseEntity<ApiResponse<PageResponse<Notification>>> getMyNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long userId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                notificationService.getMyNotifications(userId, page, size)));
    }

    @GetMapping("/unread")
    @Operation(summary = "Get my unread notifications")
    public ResponseEntity<ApiResponse<PageResponse<Notification>>> getUnreadNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long userId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                notificationService.getUnreadNotifications(userId, page, size)));
    }

    @GetMapping("/unread/count")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        Long userId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(notificationService.countUnread(userId)));
    }

    @PutMapping("/{notificationId}/read")
    @Operation(summary = "Mark single notification as read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(
            @PathVariable Long notificationId) {
        Long userId = requestContext.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
                notificationService.markAsRead(notificationId, userId),
                "Notification marked as read"));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> markAllAsRead() {
        Long userId = requestContext.getCurrentUserId();
        int count = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("markedAsRead", count), "All notifications marked as read"));
    }

    @GetMapping("/health")
    @Operation(summary = "Health check")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "notification-service"));
    }

    @PostMapping("/internal/send")
    @Operation(summary = "Internal: Send notification (called by other services)")
    public ResponseEntity<ApiResponse<Notification>> sendNotification(
            @RequestBody NotificationRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                notificationService.sendNotification(request), "Notification sent"));
    }

    @PostMapping("/internal/broadcast")
    @Operation(summary = "Internal: Broadcast notification to all users")
    public ResponseEntity<ApiResponse<Void>> broadcastNotification(
            @RequestBody NotificationRequest request) {
        notificationService.broadcastNotification(request);
        return ResponseEntity.ok(ApiResponse.success("Broadcast sent"));
    }
}
