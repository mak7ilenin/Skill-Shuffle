package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.ChatType;
import lombok.*;

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
    private boolean isMuted;
    private boolean isOnline;
    private int unreadMessages;
}