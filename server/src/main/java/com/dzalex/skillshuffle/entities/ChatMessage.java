package com.dzalex.skillshuffle.entities;

import com.dzalex.skillshuffle.enums.MessageStatus;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @Column(name = "content", nullable = false, length = 1024)
    private String content;

    @Column(name = "timestamp")
    private Timestamp timestamp;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MessageStatus status = MessageStatus.SENT;

}