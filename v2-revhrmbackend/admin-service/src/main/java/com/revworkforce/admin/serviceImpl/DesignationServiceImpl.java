package com.revworkforce.admin.serviceImpl;

import com.revworkforce.admin.dto.request.DesignationRequest;
import com.revworkforce.admin.entity.Designation;
import com.revworkforce.admin.repository.DesignationRepository;
import com.revworkforce.admin.service.ActivityLogService;
import com.revworkforce.admin.service.DesignationService;
import com.revworkforce.common.dto.PageResponse;
import com.revworkforce.common.enums.DesignationLevel;
import com.revworkforce.common.exception.DuplicateResourceException;
import com.revworkforce.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DesignationServiceImpl implements DesignationService {

    private final DesignationRepository designationRepository;
    private final ActivityLogService activityLogService;

    @Override
    @Transactional
    public Designation createDesignation(DesignationRequest request, Long adminUserId) {
        if (designationRepository.existsByTitleIgnoreCase(request.getTitle())) {
            throw new DuplicateResourceException("Designation", "title", request.getTitle());
        }
        Designation designation = Designation.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .departmentId(request.getDepartmentId())
                .level(request.getLevel() != null ? request.getLevel() : DesignationLevel.JUNIOR)
                .active(true)
                .build();
        Designation saved = designationRepository.save(designation);
        activityLogService.log(adminUserId, "CREATE", "DESIGNATION", saved.getDesignationId(),
                "Created designation: " + saved.getTitle());
        return saved;
    }

    @Override
    @Transactional
    public Designation updateDesignation(Long designationId, DesignationRequest request, Long adminUserId) {
        Designation designation = designationRepository.findById(designationId)
                .orElseThrow(() -> new ResourceNotFoundException("Designation", "id", designationId));
        if (!designation.getTitle().equalsIgnoreCase(request.getTitle())
                && designationRepository.existsByTitleIgnoreCase(request.getTitle())) {
            throw new DuplicateResourceException("Designation", "title", request.getTitle());
        }
        designation.setTitle(request.getTitle());
        designation.setDescription(request.getDescription());
        if (request.getLevel() != null) {
            designation.setLevel(request.getLevel());
        }
        Designation saved = designationRepository.save(designation);
        activityLogService.log(adminUserId, "UPDATE", "DESIGNATION", saved.getDesignationId(),
                "Updated designation: " + saved.getTitle());
        return saved;
    }

    @Override
    @Transactional
    public void deleteDesignation(Long designationId, Long adminUserId) {
        Designation designation = designationRepository.findById(designationId)
                .orElseThrow(() -> new ResourceNotFoundException("Designation", "id", designationId));
        designation.setActive(false);
        designationRepository.save(designation);
        activityLogService.log(adminUserId, "DELETE", "DESIGNATION", designationId,
                "Deactivated designation: " + designation.getTitle());
    }

    @Override
    public Designation getDesignationById(Long designationId) {
        return designationRepository.findById(designationId)
                .orElseThrow(() -> new ResourceNotFoundException("Designation", "id", designationId));
    }

    @Override
    public PageResponse<Designation> getAllDesignations(int page, int size, boolean activeOnly) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        Page<Designation> designations = activeOnly
                ? designationRepository.findByActive(true, pageable)
                : designationRepository.findAll(pageable);
        return PageResponse.of(designations);
    }

    @Override
    public List<Designation> getDesignationsByLevel(DesignationLevel level) {
        if (level == DesignationLevel.ANY) {
            return designationRepository.findByActive(true);
        }
        return designationRepository.findByActiveAndLevel(true, level);
    }

    @Override
    @Transactional
    public List<Designation> createDesignationsBulk(List<DesignationRequest> requests, Long adminUserId) {
        List<Designation> created = new ArrayList<>();
        for (DesignationRequest req : requests) {
            if (designationRepository.existsByTitleIgnoreCase(req.getTitle())) continue;
            Designation d = Designation.builder()
                    .title(req.getTitle())
                    .description(req.getDescription())
                    .departmentId(req.getDepartmentId())
                    .level(req.getLevel() != null ? req.getLevel() : DesignationLevel.JUNIOR)
                    .active(true)
                    .build();
            Designation saved = designationRepository.save(d);
            activityLogService.log(adminUserId, "CREATE", "DESIGNATION", saved.getDesignationId(),
                    "Bulk created: " + saved.getTitle());
            created.add(saved);
        }
        return created;
    }
}
