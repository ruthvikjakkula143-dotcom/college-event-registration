package com.college.events.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "events")
@Getter @Setter
public class Event {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String category;
    private String venue;

    @Column(nullable = false)
    private LocalDate eventDate;

    private int capacity = 100;

    /** Filled in by the controller; not stored in the database. */
    @Transient
    private long registeredCount;
}
