package com.college.events.service;

import com.college.events.model.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/** Simple bearer-token sessions held in memory. Tokens reset when the server restarts. */
@Service
public class AuthService {
    private final Map<String, User> sessions = new ConcurrentHashMap<>();

    public String issueToken(User user) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, user);
        return token;
    }

    public User requireUser(HttpServletRequest req) {
        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in to continue.");
        }
        User user = sessions.get(header.substring(7));
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your session has expired. Log in again.");
        }
        return user;
    }

    public User requireAdmin(HttpServletRequest req) {
        User user = requireUser(req);
        if (!"ADMIN".equals(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only administrators can do this.");
        }
        return user;
    }
}
