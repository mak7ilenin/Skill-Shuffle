package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.UserRelationshipAction;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RelationshipActionDTO {
    private String nickname;
    private UserRelationshipAction action;
}
