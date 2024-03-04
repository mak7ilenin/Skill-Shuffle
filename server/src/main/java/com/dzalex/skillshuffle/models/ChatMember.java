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
    @Id
    private Long chat_id;
    @Id
    private Long member_id;
    @Enumerated(EnumType.STRING)
    private MemberRole memberRole;
    private Timestamp joined_at;
    private Boolean notifications;
}