package com.dzalex.skillshuffle.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthUserDTO {
    private String firstName;
    private String lastName;
    private String nickname;
    private String avatarUrl;
    private int unreadMessages;
}
