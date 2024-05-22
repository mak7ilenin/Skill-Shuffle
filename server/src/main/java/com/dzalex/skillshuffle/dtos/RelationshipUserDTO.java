package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.RelationshipStatus;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RelationshipUserDTO {
    private String firstName;
    private String lastName;
    private String nickname;
    private String avatarUrl;
    private RelationshipStatus relationship;
    private boolean autoFollow;
}
