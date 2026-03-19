package com.revworkforce.admin.client;

import com.revworkforce.common.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "performance-service", path = "/api/performance")
public interface PerformanceClient {

    @GetMapping("/internal/goals/count")
    ApiResponse<Long> countTotalGoals();

    @GetMapping("/internal/goals/count-by-status")
    ApiResponse<Object> countGoalsByStatus();

    @GetMapping("/internal/goals/employee/{employeeId}/summary")
    ApiResponse<Object> getGoalSummaryByEmployee(@PathVariable Long employeeId);

    @GetMapping("/internal/goals/manager/{managerId}/assigned-count")
    ApiResponse<Long> countGoalsAssignedByManager(@PathVariable Long managerId);

    @GetMapping("/internal/reviews/employee/{employeeId}")
    ApiResponse<Object> getReviewsByEmployee(@PathVariable Long employeeId);

    @GetMapping("/internal/goals/employee/{employeeId}")
    ApiResponse<Object> getGoalsByEmployee(@PathVariable Long employeeId);
}
