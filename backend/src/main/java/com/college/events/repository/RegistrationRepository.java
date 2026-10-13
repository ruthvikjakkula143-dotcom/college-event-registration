package com.college.events.repository;

import com.college.events.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
    long countByEventIdAndStatusNot(Long eventId, String status);
    List<Registration> findByUserIdOrderByRegisteredAtDesc(Long userId);
    List<Registration> findAllByOrderByRegisteredAtDesc();
    void deleteByEventId(Long eventId);
}
