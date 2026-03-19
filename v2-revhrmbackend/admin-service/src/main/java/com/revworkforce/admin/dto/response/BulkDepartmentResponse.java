package com.revworkforce.admin.dto.response;

import com.revworkforce.admin.entity.Department;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkDepartmentResponse {

    private int totalRequested;
    private int totalCreated;
    private int totalSkipped;
    private List<Department> created;
    private List<String> skipped;
}