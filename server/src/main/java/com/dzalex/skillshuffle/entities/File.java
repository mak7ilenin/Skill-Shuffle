package com.dzalex.skillshuffle.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "files")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "data", nullable = false)
    private byte[] data;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "file_path")
    private String filePath;

}