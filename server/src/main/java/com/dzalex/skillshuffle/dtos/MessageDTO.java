package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.MessageStatus;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageDTO {
    private Long id;
    private MessageSender sender;
    private String content;
    private Timestamp timestamp;
    private MessageStatus status;
}