package com.dzalex.skillshuffle.dtos;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserFollowerDTO {
    private List<RelationshipUserDTO> pending;
    private List<RelationshipUserDTO> outgoing;
}
