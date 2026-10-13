package com.college.events.controller;

import com.college.events.model.User;
import com.college.events.repository.UserRepository;
import com.college.events.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final BCryptPasswordEncoder encoder;
    private final AuthService auth;

    public AuthController(UserRepository users, BCryptPasswordEncoder encoder, AuthService auth) {
        this.users = users;
        this.encoder = encoder;
        this.auth = auth;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> body) {
        String name = body.getOrDefault("name", "").trim();
        String email = body.getOrDefault("email", "").trim().toLowerCase();
        String password = body.getOrDefault("password", "");
        if (name.isEmpty() || email.isEmpty() || password.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Enter your name, email and a password of at least 6 characters.");
        }
        if (users.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setDepartment(body.get("department"));
        user.setRole("STUDENT");
        users.save(user);
        return session(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "").trim().toLowerCase();
        User user = users.findByEmail(email).orElse(null);
        if (user == null || !encoder.matches(body.getOrDefault("password", ""), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect.");
        }
        return session(user);
    }

    private Map<String, Object> session(User user) {
        return Map.of("token", auth.issueToken(user), "user", user);
    }
}
