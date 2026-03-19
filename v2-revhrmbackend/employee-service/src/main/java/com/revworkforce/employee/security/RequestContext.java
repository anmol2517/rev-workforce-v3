package com.revworkforce.employee.security;

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
            String userId = getCurrentRequest().getHeader("X-User-Id");
            if (userId != null && !userId.isBlank()) return Long.parseLong(userId);
        } catch (Exception e) {
            log.warn("Could not extract user id: {}", e.getMessage());
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

    public Long getCurrentEmployeeIdAsLong() {
        try {
            String empId = getCurrentRequest().getHeader("X-Employee-Id");
            if (empId != null && !empId.isBlank()) return Long.parseLong(empId);
        } catch (Exception e) {
            log.warn("Could not extract employee id: {}", e.getMessage());
        }
        return null;
    }

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) throw new IllegalStateException("No current request");
        return attrs.getRequest();
    }
}
