package com.dzalex.skillshuffle.entities;

import com.dzalex.skillshuffle.enums.CommunityPrivacy;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

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

    @ColumnDefault("#bdbdbd")
    @Column(name = "banner_color", nullable = false, length = 7)
    private String bannerColor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @ColumnDefault("open")
    @Enumerated(EnumType.STRING)
    @Column(name = "privacy", nullable = false)
    private CommunityPrivacy privacy;

    @ColumnDefault("1")
    @Column(name = "allow_comments", nullable = false)
    private Byte allowComments;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

}