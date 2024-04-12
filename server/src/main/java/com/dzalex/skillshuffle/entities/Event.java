package com.dzalex.skillshuffle.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Lob
    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "title", nullable = false, length = 75)
    private String title;

    @Column(name = "description", nullable = false, length = 1024)
    private String description;

    @Column(name = "banner_url", nullable = false)
    private String bannerUrl;

    @Column(name = "starts_at", nullable = false)
    private Timestamp startsAt;

    @Column(name = "ends_at", nullable = false)
    private Timestamp endsAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

}