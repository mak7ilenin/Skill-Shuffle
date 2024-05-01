package com.dzalex.skillshuffle.entities;

import com.dzalex.skillshuffle.enums.CommunityPrivacy;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "communities")
public class Community {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, length = 75)
    private String name;

    @Column(name = "nickname", nullable = false, length = 50)
    private String nickname;

    @Column(name = "description", length = 275)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private CommunitySubject subject;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "banner_url")
    private String bannerUrl;

    @Builder.Default
    @Column(name = "banner_color", length = 7)
    private String bannerColor = "#bdbdbd";

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "privacy")
    private CommunityPrivacy privacy = CommunityPrivacy.OPEN;

    @Builder.Default
    @Column(name = "allow_comments", nullable = false)
    private boolean allowComments = true;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

}