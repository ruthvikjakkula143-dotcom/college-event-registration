package com.college.events.controller;

import com.college.events.model.Event;
import com.college.events.model.Registration;
import com.college.events.model.User;
import com.college.events.repository.EventRepository;
import com.college.events.repository.RegistrationRepository;
import com.college.events.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {
    private static final Set<String> STATUSES = Set.of("PENDING", "CONFIRMED", "CANCELLED");

    private final RegistrationRepository registrations;
    private final EventRepository events;
    private final AuthService auth;

    public RegistrationController(RegistrationRepository registrations, EventRepository events, AuthService auth) {
        this.registrations = registrations;
        this.events = events;
        this.auth = auth;
    }

    /** A student registers for an event. */
    @PostMapping
    public Registration register(@RequestBody Map<String, Object> body, HttpServletRequest req) {
        User user = auth.requireUser(req);
        Long eventId = Long.valueOf(String.valueOf(body.get("eventId")));
        Event event = events.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));

        if (registrations.existsByUserIdAndEventId(user.getId(), eventId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You are already registered for this event.");
        }
        if (registrations.countByEventIdAndStatusNot(eventId, "CANCELLED") >= event.getCapacity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This event is full.");
        }
        Registration r = new Registration();
        r.setUser(user);
        r.setEvent(event);
        Object dept = body.get("department");
        r.setDepartment(dept != null ? dept.toString() : user.getDepartment());
        return registrations.save(r);
    }

    /** The logged-in student's own registrations. */
    @GetMapping("/me")
    public List<Registration> mine(HttpServletRequest req) {
        return registrations.findByUserIdOrderByRegisteredAtDesc(auth.requireUser(req).getId());
    }

    /** Admin: every registration. */
    @GetMapping
    public List<Registration> all(HttpServletRequest req) {
        auth.requireAdmin(req);
        return registrations.findAllByOrderByRegisteredAtDesc();
    }

    /** Admin: confirm or cancel a registration. */
    @PatchMapping("/{id}/status")
    public Registration setStatus(@PathVariable Long id, @RequestBody Map<String, String> body, HttpServletRequest req) {
        auth.requireAdmin(req);
        String status = body.getOrDefault("status", "");
        if (!STATUSES.contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status must be PENDING, CONFIRMED or CANCELLED.");
        }
        Registration r = find(id);
        r.setStatus(status);
        return registrations.save(r);
    }

    /** Students can withdraw their own registration; admins can remove any. */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, HttpServletRequest req) {
        User user = auth.requireUser(req);
        Registration r = find(id);
        if (!"ADMIN".equals(user.getRole()) && !r.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only withdraw your own registration.");
        }
        registrations.delete(r);
    }

    private Registration find(Long id) {
        return registrations.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found."));
    }
}
