package com.revworkforce.notification.security;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Component
public class RequestContext {

    public Long getCurrentUserId() {
        try {
            String val = getCurrentRequest().getHeader("X-User-Id");
            if (val != null && !val.isBlank()) return Long.parseLong(val);
        } catch (Exception e) {
            log.warn("Could not extract userId: {}", e.getMessage());
        }
        return null;
    }

    public String getCurrentUserRole() {
        try {
            return getCurrentRequest().getHeader("X-User-Role");
        } catch (Exception e) {
            return null;
        }
    }

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) throw new IllegalStateException("No current request");
        return attrs.getRequest();
    }
}
