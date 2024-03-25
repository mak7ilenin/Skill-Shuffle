package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.MessageStatus;
import com.dzalex.skillshuffle.enums.MessageType;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageDTO {
    private Long id;
    private PublicUserDTO sender;
    private String content;
    private MessageType type;
    private Timestamp timestamp;
    private MessageStatus status;
}