package com.dzalex.skillshuffle.entities;

import com.dzalex.skillshuffle.enums.PostPrivacy;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.*;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(name = "text", nullable = false, length = 3000)
    private String text;

    @Enumerated(EnumType.STRING)
    @Column(name = "privacy", nullable = false)
    private PostPrivacy privacy;

    @Column(name = "likes_count", length = 7)
    private int likesCount = 0;

    @Column(name = "comments_count", length = 7)
    private int commentsCount = 0;

    @Column(name = "shares_count", length = 7)
    private int sharesCount = 0;

    @Column(name = "allow_comments")
    private boolean allowComments = true;

    @Column(name = "allow_notifications")
    private boolean allowNotifications = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;

}