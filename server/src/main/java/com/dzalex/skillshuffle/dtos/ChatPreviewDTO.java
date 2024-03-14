package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.ChatType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatPreviewDTO {
    private Long id;
    private String name;
    private ChatType chatType;
    private String avatar_url;
    private MessageDTO last_message;
}