package com.dzalex.skillshuffle.models;

import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.enums.NotificationType;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatNotification {
    private Chat chat;
    private PublicUserDTO sender;
    private String message;
    private NotificationType type;
}
