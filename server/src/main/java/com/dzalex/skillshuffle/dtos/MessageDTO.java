package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.MessageType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageDTO {
    private Integer id;
    private Integer chatId;
    private PublicUserDTO sender;
    private String content;
    private Timestamp timestamp;
    private MessageType type;

    @JsonIgnore
    public boolean isMessage() {
        return this.type == MessageType.MESSAGE;
    }

    @JsonIgnore
    public boolean isAnnouncement() {
        return this.type == MessageType.ANNOUNCEMENT;
    }

    @JsonIgnore
    public boolean isEntry() {
        return this.type == MessageType.ENTRY;
    }
}