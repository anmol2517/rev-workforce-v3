package com.revworkforce.common.dto;

import com.revworkforce.common.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private Long recipientUserId;
    private String title;
    private String message;
    private NotificationType type;
    private String referenceId;
    private String referenceType;
}
