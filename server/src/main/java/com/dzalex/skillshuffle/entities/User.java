package com.dzalex.skillshuffle.entities;

import com.dzalex.skillshuffle.enums.Gender;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "first_name", nullable = false, length = 30)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 30)
    private String lastName;

    @Column(name = "username", nullable = false, length = 75, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "nickname", nullable = false, length = 40, unique = true)
    private String nickname;

    @Column(name = "email", unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "birth_date")
    private Date birthDate;

    @Column(name = "bio", length = 275)
    private String bio;

    @Builder.Default
    @Column(name = "points", nullable = false)
    private Integer points = 0;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "banner_url")
    private String bannerUrl;

    @Builder.Default
    @Column(name = "banner_color")
    private String bannerColor = "#00b3db";

    @Builder.Default
    @Column(name = "is_public")
    private boolean isPublic = true;

    @Builder.Default
    @Column(name = "auto_follow")
    private boolean autoFollow = false;

    @CreationTimestamp
    @Column(name = "last_seen")
    private Timestamp lastSeen;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;

    @JsonIgnore
    public boolean isOnline() {
        return lastSeen.after(new Timestamp(System.currentTimeMillis() - 300000));
    }
}