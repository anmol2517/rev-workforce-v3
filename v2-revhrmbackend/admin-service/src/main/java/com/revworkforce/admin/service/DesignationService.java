package com.revworkforce.admin.service;

import com.revworkforce.admin.dto.request.DesignationRequest;
import com.revworkforce.admin.entity.Designation;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.common.enums.DesignationLevel;

import java.util.List;

public interface DesignationService {
    Designation createDesignation(DesignationRequest request, Long adminUserId);
    Designation updateDesignation(Long designationId, DesignationRequest request, Long adminUserId);
    void deleteDesignation(Long designationId, Long adminUserId);
    Designation getDesignationById(Long designationId);
    PageResponse<Designation> getAllDesignations(int page, int size, boolean activeOnly);
    List<Designation> getDesignationsByLevel(DesignationLevel level);
    List<Designation> createDesignationsBulk(List<DesignationRequest> requests, Long adminUserId);
}
