package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.Gender;
import com.dzalex.skillshuffle.enums.RelationshipStatus;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileDTO {
    private String firstName;
    private String lastName;
    private String nickname;
    private Gender gender;
    private Date birthDate;
    private String bio;
    private Integer points;
    private String avatarUrl;
    private String bannerUrl;
    private String bannerColor;
    private RelationshipStatus relationship;
    private boolean isPublic;
    private boolean autoFollow;
    private Timestamp lastSeen;
    private Timestamp joinedAt;
    private int followersCount;
    private List<PublicUserDTO> friends;
    private List<PostDTO> posts;
    private List<SearchedUserDTO> mightKnow;
    private List<SearchedUserDTO> mutualFriends;
}
