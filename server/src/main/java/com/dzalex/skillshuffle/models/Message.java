package com.dzalex.skillshuffle.models;

import com.dzalex.skillshuffle.enums.MessageStatus;
import com.dzalex.skillshuffle.enums.MessageType;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Table(name = "chat_messages")
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;
    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chat chat;
    private String content;
    private Timestamp timestamp;
    @Enumerated(EnumType.STRING)
    private MessageType type;
    @Enumerated(EnumType.STRING)
    private MessageStatus status;
}