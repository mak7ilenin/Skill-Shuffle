package com.dzalex.skillshuffle.dtos;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PublicUserDTO {
    private String firstName;
    private String lastName;
    private String nickname;
    private String avatarUrl;
    private Timestamp lastSeen;
}
