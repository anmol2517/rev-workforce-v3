package com.revworkforce.performance.security;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Component
public class RequestContext {
    public Long getCurrentUserId() {
        try { String v = getCurrentRequest().getHeader("X-User-Id"); if (v != null && !v.isBlank()) return Long.parseLong(v); } catch (Exception e) { log.warn("userId extract failed"); }
        return null;
    }
    public Long getCurrentEmployeeId() {
        try { String v = getCurrentRequest().getHeader("X-Employee-Id"); if (v != null && !v.isBlank()) return Long.parseLong(v); } catch (Exception e) { log.warn("empId extract failed"); }
        return null;
    }
    public Long getCurrentManagerId() {
        // X-Manager-Id gateway set nahi karta, X-Employee-Id use karo
        try { String v = getCurrentRequest().getHeader("X-Employee-Id"); if (v != null && !v.isBlank()) return Long.parseLong(v); } catch (Exception e) { log.warn("mgr extract failed"); }
        return null;
    }
    public String getCurrentUserEmail() {
        try { return getCurrentRequest().getHeader("X-User-Email"); } catch (Exception e) { return null; }
    }
    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) throw new IllegalStateException("No current request");
        return attrs.getRequest();
    }
}
