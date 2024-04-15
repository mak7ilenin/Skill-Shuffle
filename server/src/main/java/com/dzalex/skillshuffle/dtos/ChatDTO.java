package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.ChatType;
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
    private String avatarUrl;
    private List<MessageDTO> messages;
    private int memberCount;
    private PublicUserDTO chatPartner;
}