package com.college.events.controller;

import com.college.events.model.Event;
import com.college.events.repository.EventRepository;
import com.college.events.repository.RegistrationRepository;
import com.college.events.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventRepository events;
    private final RegistrationRepository registrations;
    private final AuthService auth;

    public EventController(EventRepository events, RegistrationRepository registrations, AuthService auth) {
        this.events = events;
        this.registrations = registrations;
        this.auth = auth;
    }

    @GetMapping
    public List<Event> list() {
        List<Event> all = events.findAllByOrderByEventDateAsc();
        all.forEach(this::fillCount);
        return all;
    }

    @PostMapping
    public Event create(@RequestBody Event event, HttpServletRequest req) {
        auth.requireAdmin(req);
        event.setId(null);
        return fillCount(events.save(event));
    }

    @PutMapping("/{id}")
    public Event update(@PathVariable Long id, @RequestBody Event incoming, HttpServletRequest req) {
        auth.requireAdmin(req);
        Event event = events.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));
        event.setTitle(incoming.getTitle());
        event.setDescription(incoming.getDescription());
        event.setCategory(incoming.getCategory());
        event.setVenue(incoming.getVenue());
        event.setEventDate(incoming.getEventDate());
        event.setCapacity(incoming.getCapacity());
        return fillCount(events.save(event));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void delete(@PathVariable Long id, HttpServletRequest req) {
        auth.requireAdmin(req);
        registrations.deleteByEventId(id);
        events.deleteById(id);
    }

    private Event fillCount(Event e) {
        e.setRegisteredCount(registrations.countByEventIdAndStatusNot(e.getId(), "CANCELLED"));
        return e;
    }
}
