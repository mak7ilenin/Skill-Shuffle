package com.dzalex.skillshuffle.entities;

import com.dzalex.skillshuffle.enums.MemberRole;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chat_members")
public class ChatMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private MemberRole role;

    @Builder.Default
    @Column(name = "notifications")
    private boolean notifications = true;

    @CreationTimestamp
    @Column(name = "joined_at")
    private Timestamp joinedAt;

    @Column(name = "left_at")
    private Timestamp leftAt;

    @Builder.Default
    @Column(name = "is_kicked")
    private boolean isKicked = false;

    @Column(name = "cleared_at")
    private Timestamp clearedAt;

    @Column(name = "closed_at")
    private Timestamp closedAt;

    @JsonIgnore
    public boolean isOwner() {
        return role == MemberRole.CREATOR;
    }

    @JsonIgnore
    public boolean isAdmin() {
        return role == MemberRole.ADMIN;
    }

    @JsonIgnore
    public boolean isMember() {
        return role == MemberRole.MEMBER;
    }

    @JsonIgnore
    public boolean isLeft() {
        return leftAt != null;
    }

    @JsonIgnore
    public boolean isKicked() {
        return isKicked;
    }

    @JsonIgnore
    public boolean hasNotifications() {
        return notifications;
    }

    @JsonIgnore
    public boolean isCleared() {
        return clearedAt != null;
    }
}