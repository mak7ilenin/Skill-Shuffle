package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.entities.Chat;
import com.dzalex.skillshuffle.enums.NotificationType;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatNotificationDTO {
    private Chat chat;
    private PublicUserDTO sender;
    private String message;
    private String content;
    private NotificationType type;
}