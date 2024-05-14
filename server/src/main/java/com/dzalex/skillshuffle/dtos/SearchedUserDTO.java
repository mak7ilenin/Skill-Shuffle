package com.dzalex.skillshuffle.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchedUserDTO {
    private String firstName;
    private String lastName;
    private String nickname;
    private String avatarUrl;
    private boolean isFriend;
    private boolean isFollowed;
    private boolean isFollower;
    private boolean autoFollow;
}
