package com.revworkforce.admin.security;

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
            HttpServletRequest request = getCurrentRequest();
            String userId = request.getHeader("X-User-Id");
            if (userId != null && !userId.isBlank()) {
                return Long.parseLong(userId);
            }
        } catch (Exception e) {
            log.warn("Could not extract user id from request: {}", e.getMessage());
        }
        return null;
    }

    public String getCurrentUserRole() {
        try {
            HttpServletRequest request = getCurrentRequest();
            return request.getHeader("X-User-Role");
        } catch (Exception e) {
            log.warn("Could not extract user role from request: {}", e.getMessage());
        }
        return null;
    }

    public String getCurrentUserEmail() {
        try {
            HttpServletRequest request = getCurrentRequest();
            return request.getHeader("X-User-Email");
        } catch (Exception e) {
            log.warn("Could not extract user email from request: {}", e.getMessage());
        }
        return null;
    }

    public String getCurrentEmployeeId() {
        try {
            HttpServletRequest request = getCurrentRequest();
            return request.getHeader("X-Employee-Id");
        } catch (Exception e) {
            log.warn("Could not extract employee id from request: {}", e.getMessage());
        }
        return null;
    }

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new IllegalStateException("No current request found");
        }
        return attributes.getRequest();
    }
}
