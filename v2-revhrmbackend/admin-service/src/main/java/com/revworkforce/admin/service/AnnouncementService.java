package com.revworkforce.admin.service;

import com.revworkforce.admin.dto.request.AnnouncementRequest;
import com.revworkforce.admin.entity.Announcement;
import com.revworkforce.common.dto.PageResponse;

public interface AnnouncementService {
    Announcement createAnnouncement(AnnouncementRequest request, Long adminUserId);
    Announcement updateAnnouncement(Long announcementId, AnnouncementRequest request, Long adminUserId);
    void deleteAnnouncement(Long announcementId, Long adminUserId);
    Announcement getAnnouncementById(Long announcementId);
    PageResponse<Announcement> getAllAnnouncements(int page, int size);
    PageResponse<Announcement> getActiveAnnouncements(int page, int size);
}
