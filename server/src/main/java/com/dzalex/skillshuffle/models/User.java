package com.dzalex.skillshuffle.models;

import com.dzalex.skillshuffle.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "users")
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String first_name;
    private String last_name;
    @Column(unique = true)
    private String username;
    private String password;
    @Column(unique = true)
    private String nickname;
    @Column(unique = true)
    private String email;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    private Date birth_date;
    private String bio;
    private Integer points = 0;
    private String avatar_url;
    private String banner_url;
    private String banner_color = "#bdbdbd";
    private Boolean is_public = true;
    private Boolean auto_follow = false;
    private Timestamp last_seen;
    private Timestamp created_at;
    private Timestamp updated_at;
    private Timestamp deleted_at;

    public User(String first_name, String last_name, String username, String password, String nickname, String email, Gender gender, Date birth_date, String bio, String avatar_url) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
        this.gender = gender;
        this.birth_date = birth_date;
        this.bio = bio;
        this.avatar_url = avatar_url;
    }
}