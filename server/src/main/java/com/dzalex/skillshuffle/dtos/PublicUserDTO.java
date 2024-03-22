package com.dzalex.skillshuffle.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PublicUserDTO {
    private String first_name;
    private String last_name;
    private String nickname;
    private String avatar_url;
}
