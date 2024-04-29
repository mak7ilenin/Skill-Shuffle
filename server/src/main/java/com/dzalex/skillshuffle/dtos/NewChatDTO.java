package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.ChatType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NewChatDTO {
    private String name;
    private String avatarUrl;
    private ChatType type;
    private String[] members;

    @JsonIgnore
    public boolean isPrivate() {
        return type == ChatType.PRIVATE;
    }

    @JsonIgnore
    public boolean isGroup() {
        return type == ChatType.GROUP;
    }

    @JsonIgnore
    public boolean isCommunity() {
        return type == ChatType.COMMUNITY;
    }
}
