package com.dzalex.skillshuffle.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommunityPreviewDTO {
    private String name;
    private String nickname;
    private String description;
    private String avatarUrl;
}
