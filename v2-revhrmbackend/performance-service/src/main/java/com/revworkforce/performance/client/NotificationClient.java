package com.revworkforce.performance.client;

import com.revworkforce.common.dto.ApiResponse;
import com.revworkforce.common.dto.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", path = "/api/notifications")
public interface NotificationClient {

    @PostMapping("/internal/send")
    ApiResponse<Void> sendNotification(@RequestBody NotificationRequest request);
}
