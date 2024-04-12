package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.entities.Community;
import com.dzalex.skillshuffle.enums.ChatType;
import com.dzalex.skillshuffle.entities.User;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatDTO {
    private Integer id;
    private String name;
    private ChatType type;
    private String avatar_url;
    private List<MessageDTO> messages;
    private List<String> members;
    private Community community;
    private User user;
}