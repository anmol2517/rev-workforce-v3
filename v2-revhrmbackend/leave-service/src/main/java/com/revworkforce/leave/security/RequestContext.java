package com.revworkforce.leave.security;
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
        } catch (Exception e) { log.warn("userId extract failed: {}", e.getMessage()); }
        return null;
    }
    public Long getCurrentEmployeeId() {
        try {
            String val = getCurrentRequest().getHeader("X-Employee-Id");
            if (val != null && !val.isBlank()) return Long.parseLong(val);
        } catch (Exception e) { log.warn("employeeId extract failed: {}", e.getMessage()); }
        return null;
    }
    public Long getCurrentManagerId() {
        // X-Manager-Id gateway set nahi karta, X-Employee-Id use karo
        try {
            String val = getCurrentRequest().getHeader("X-Employee-Id");
            if (val != null && !val.isBlank()) return Long.parseLong(val);
        } catch (Exception e) { log.warn("managerId extract failed: {}", e.getMessage()); }
        return null;
    }
    public String getCurrentUserEmail() {
        try { return getCurrentRequest().getHeader("X-User-Email"); }
        catch (Exception e) { return null; }
    }
    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) throw new IllegalStateException("No current request");
        return attrs.getRequest();
    }
}