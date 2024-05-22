package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.ChatType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatPreviewDTO {
    private Integer id;
    private String name;
    private ChatType type;
    private String avatarUrl;
    private MessageDTO lastMessage;
    @JsonIgnore
    private Timestamp lastMessageTimestamp;
    private boolean isMuted;
    private boolean isOnline;
    private int unreadMessages;
}