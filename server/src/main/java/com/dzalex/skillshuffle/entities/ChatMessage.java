package com.dzalex.skillshuffle.entities;

import com.dzalex.skillshuffle.enums.MessageType;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @Column(name = "content", nullable = false, length = 1024)
    private String content;

    @Column(name = "timestamp", nullable = false)
    private Timestamp timestamp;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private MessageType type;

    @JsonIgnore
    public boolean isMessage() {
        return this.type == MessageType.MESSAGE;
    }

    @JsonIgnore
    public boolean isAnnouncement() {
        return this.type == MessageType.ANNOUNCEMENT;
    }

    @JsonIgnore
    public boolean isEntry() {
        return this.type == MessageType.ENTRY;
    }
}