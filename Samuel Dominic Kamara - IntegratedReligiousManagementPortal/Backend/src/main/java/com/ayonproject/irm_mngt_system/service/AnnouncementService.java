package com.ayonproject.irm_mngt_system.service;

import com.ayonproject.irm_mngt_system.model.Announcement;

import java.util.List;

public interface AnnouncementService {
    Announcement saveAnnouncement(Announcement announcement);
    List<Announcement> getAllAnnouncements();
    Announcement getAnnouncementById(Long id);
    Announcement updateAnnouncement(Long id, Announcement announcement);
    boolean deleteAnnouncement(Long id);

    long countAnnouncements();
}
