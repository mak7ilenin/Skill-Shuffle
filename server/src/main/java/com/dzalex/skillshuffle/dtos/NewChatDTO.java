package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.ChatType;
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

    public boolean isPrivate() {
        return type == ChatType.PRIVATE;
    }

    public boolean isGroup() {
        return type == ChatType.GROUP;
    }

    public boolean isCommunity() {
        return type == ChatType.COMMUNITY;
    }
}
