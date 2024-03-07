package com.dzalex.skillshuffle.models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "chat_message_attachments")
@Entity
public class MessageAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Id
    private Long message_id;
    @Id
    private Long photo_id;
    @Id
    private Long video_id;
    @Id
    private Long file_id;
}