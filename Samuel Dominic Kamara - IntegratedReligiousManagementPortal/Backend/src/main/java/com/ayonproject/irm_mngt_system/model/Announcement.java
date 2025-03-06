package com.ayonproject.irm_mngt_system.model;

import java.time.LocalDate;

public class Announcement {
    private long id;
    private String title;
    private String description;
    private LocalDate date;

    // Constructor with all fields
    public Announcement(long id, String title, String description, LocalDate date) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.date = date;
    }

    // Default constructor
    public Announcement() {}

    // Getters and Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() { return date; }

    public void setDate(LocalDate date) { this.date = date; }
}
