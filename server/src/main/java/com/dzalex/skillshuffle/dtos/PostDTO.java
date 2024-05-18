package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.entities.Post;
import com.dzalex.skillshuffle.entities.PostAttachment;
import com.dzalex.skillshuffle.enums.PostPrivacy;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDTO {
    private Integer id;
    private PublicUserDTO author;
    private String text;
    private PostPrivacy privacy;
    private boolean allowComments;
    private boolean allowNotifications;
    private List<PostAttachment> attachments;
    private String createdAt;
    private String updatedAt;
}
