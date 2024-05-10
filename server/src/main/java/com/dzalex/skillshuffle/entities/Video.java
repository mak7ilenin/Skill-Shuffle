package com.dzalex.skillshuffle.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "videos")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "duration", nullable = false)
    private LocalTime duration;

    @Column(name = "resolution", nullable = false, length = 50)
    private String resolution;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @ColumnDefault("0")
    @Column(name = "views", nullable = false)
    private Integer views;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

}