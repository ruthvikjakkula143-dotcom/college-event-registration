package com.college.events;

import com.college.events.model.Event;
import com.college.events.model.User;
import com.college.events.repository.EventRepository;
import com.college.events.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;

@SpringBootApplication
public class EventRegistrationApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventRegistrationApplication.class, args);
    }

    /** Seeds a default admin account and a few sample events on first run. */
    @Bean
    CommandLineRunner seed(UserRepository users, EventRepository events, BCryptPasswordEncoder enc) {
        return args -> {
            if (users.findByEmail("admin@college.edu").isEmpty()) {
                User admin = new User();
                admin.setName("Campus Admin");
                admin.setEmail("admin@college.edu");
                admin.setPassword(enc.encode("admin123"));
                admin.setRole("ADMIN");
                admin.setDepartment("Administration");
                users.save(admin);
            }
            if (events.count() == 0) {
                events.save(sample("Tech Talk: Building with Spring Boot", "Technical", "Seminar Hall A",
                        LocalDate.now().plusDays(10), 120, "A hands-on session on building REST APIs with Spring Boot and MySQL."));
                events.save(sample("Cultural Fest", "Cultural", "Main Auditorium",
                        LocalDate.now().plusDays(20), 500, "Music, dance and drama performances by students from every department."));
                events.save(sample("Sports Day", "Sports", "College Ground",
                        LocalDate.now().plusDays(30), 300, "Track events, relay races and inter-department team games."));
            }
        };
    }

    private Event sample(String title, String category, String venue, LocalDate date, int capacity, String desc) {
        Event e = new Event();
        e.setTitle(title);
        e.setCategory(category);
        e.setVenue(venue);
        e.setEventDate(date);
        e.setCapacity(capacity);
        e.setDescription(desc);
        return e;
    }
}
