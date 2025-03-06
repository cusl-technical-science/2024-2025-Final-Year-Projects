package com.ayonproject.irm_mngt_system.service;

import com.ayonproject.irm_mngt_system.entity.EventEntity;
import com.ayonproject.irm_mngt_system.model.Event;
import com.ayonproject.irm_mngt_system.repository.EventRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public Event saveEvent(Event event) {
        EventEntity eventEntity = new EventEntity();
        BeanUtils.copyProperties(event, eventEntity);
        eventEntity = eventRepository.save(eventEntity); // Save and retrieve the saved entity
        return convertEntityToModel(eventEntity);
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(this::convertEntityToModel)
                .collect(Collectors.toList());
    }

    @Override
    public Event getEventById(Long id) {
        Optional<EventEntity> optionalEntity = eventRepository.findById(id);
        if (optionalEntity.isEmpty()) {
            throw new RuntimeException("Event not found for ID: " + id); // Throw exception for missing event
        }
        return convertEntityToModel(optionalEntity.get());
    }

    @Override
    public boolean deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return true;
        }
        throw new RuntimeException("Event not found for ID: " + id); // Throw exception if the event doesn't exist
    }

    @Override
    public Event updateEvent(Long id, Event event) {
        EventEntity existingEntity = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found for ID: " + id));

        // Update fields of the existing entity
        BeanUtils.copyProperties(event, existingEntity, "id");
        EventEntity updatedEntity = eventRepository.save(existingEntity);
        return convertEntityToModel(updatedEntity);
    }

    @Override
    public long countEvents() {
        return eventRepository.count(); // Return the count of events
    }

    // Helper method to convert EventEntity to Event model
    private Event convertEntityToModel(EventEntity entity) {
        return new Event(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getLocation(),
                entity.getDate()
        );
    }
}
