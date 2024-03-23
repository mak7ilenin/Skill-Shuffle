package com.dzalex.skillshuffle.models;

import com.dzalex.skillshuffle.enums.MemberRole;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "chat_members")
@Entity
public class ChatMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id")
    private Chat chat;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id")
    private User member;
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private MemberRole memberRole;
    private Timestamp joined_at;
    private Boolean notifications;
}