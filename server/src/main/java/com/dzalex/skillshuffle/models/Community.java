package com.dzalex.skillshuffle.models;

import com.dzalex.skillshuffle.enums.CommunityPrivacy;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "communities")
@Entity
public class Community {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String nickname;
    private String description;
    @ManyToOne
    @JoinColumn(name = "subject_id")
    private CommunitySubject subject;
    private String avatar_url;
    private String banner_url;
    private String banner_color = "#bdbdbd";
    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;
    private CommunityPrivacy privacy;
    private Boolean allow_comments = true;
    private Timestamp created_at;
}