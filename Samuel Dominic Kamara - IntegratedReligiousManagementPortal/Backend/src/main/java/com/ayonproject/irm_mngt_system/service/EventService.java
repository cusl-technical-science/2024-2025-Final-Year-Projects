package com.ayonproject.irm_mngt_system.service;

import com.ayonproject.irm_mngt_system.model.Event;

import java.util.List;

public interface EventService {
    Event saveEvent(Event event);
    List<Event> getAllEvents();
    Event getEventById(Long id);
    Event updateEvent(Long id, Event event);
    boolean deleteEvent(Long id);

    long countEvents();

}
