package com.ayonproject.irm_mngt_system.service;

import com.ayonproject.irm_mngt_system.entity.AnnouncementEntity;
import com.ayonproject.irm_mngt_system.model.Announcement;
import com.ayonproject.irm_mngt_system.repository.AnnouncementRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;  // Set a date format

    public AnnouncementServiceImpl(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @Override
    public Announcement saveAnnouncement(Announcement announcement) {
        AnnouncementEntity announcementEntity = new AnnouncementEntity();
        BeanUtils.copyProperties(announcement, announcementEntity);

        // Convert LocalDate to String if date is present
        if (announcement.getDate() != null) {
            announcementEntity.setDate(announcement.getDate().format(formatter));
        }

        announcementRepository.save(announcementEntity);
        return announcement;
    }

    @Override
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll()
                .stream()
                .map(entity -> {
                    Announcement announcement = new Announcement();
                    BeanUtils.copyProperties(entity, announcement);

                    // Convert String to LocalDate if date is present
                    if (entity.getDate() != null) {
                        announcement.setDate(LocalDate.parse(entity.getDate(), formatter));
                    }

                    return announcement;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Announcement getAnnouncementById(Long id) {
        AnnouncementEntity entity = announcementRepository.findById(id).orElse(null);
        if (entity == null) {
            return null;
        }

        Announcement announcement = new Announcement();
        BeanUtils.copyProperties(entity, announcement);

        // Convert String to LocalDate if date is present
        if (entity.getDate() != null) {
            announcement.setDate(LocalDate.parse(entity.getDate(), formatter));
        }

        return announcement;
    }

    @Override
    public boolean deleteAnnouncement(Long id) {
        if (announcementRepository.existsById(id)) {
            announcementRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Announcement updateAnnouncement(Long id, Announcement announcement) {
        AnnouncementEntity entity = announcementRepository.findById(id).orElse(null);
        if (entity == null) {
            return null;
        }

        entity.setTitle(announcement.getTitle());
        entity.setDescription(announcement.getDescription());

        // Update date if present, converting LocalDate to String
        if (announcement.getDate() != null) {
            entity.setDate(announcement.getDate().format(formatter));
        } else {
            entity.setDate(null);
        }

        announcementRepository.save(entity);
        BeanUtils.copyProperties(entity, announcement);

        return announcement;
    }

    @Override
    public long countAnnouncements() {
        return announcementRepository.count();  // New count implementation
    }
}
