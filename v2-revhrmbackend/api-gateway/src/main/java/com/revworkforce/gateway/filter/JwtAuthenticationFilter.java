package com.revworkforce.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.security.Key;
import java.util.Base64;
import java.util.List;

@Slf4j
@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret}")
    private String secret;

    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/refresh",
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/swagger-ui",
            "/v3/api-docs",
            "/actuator"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }

        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange);
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = extractClaims(token);

            // userId is a Long (Integer in JWT parsing) — always use this as identity key
            Object userIdObj = claims.get("userId");
            String userId = userIdObj != null ? String.valueOf(((Number) userIdObj).longValue()) : "";

            String role = claims.get("role", String.class);
            String email = claims.get("email", String.class);
            String empCode = claims.get("empCode", String.class);

            // FIX: X-Employee-Id must be the numeric userId (Long), NOT empCode string.
            // All microservices do Long.parseLong(X-Employee-Id) to find employee records.
            // Sending "EMP-001" here caused NumberFormatException in every service.
            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-User-Id", userId)
                    .header("X-User-Role", role != null ? role : "")
                    .header("X-Employee-Id", userId)           // numeric userId as Long
                    .header("X-Emp-Code", empCode != null ? empCode : "")  // raw empCode string
                    .header("X-User-Email", email != null ? email : "")
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());

        } catch (Exception e) {
            log.error("JWT validation failed: {}", e.getMessage());
            return unauthorized(exchange);
        }
    }

    private Claims extractClaims(String token) {
        byte[] keyBytes = Base64.getEncoder().encode(secret.getBytes());
        Key key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(keyBytes));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        byte[] bytes = "{\"success\":false,\"error\":\"Unauthorized: Invalid or missing token\"}".getBytes();
        var buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
