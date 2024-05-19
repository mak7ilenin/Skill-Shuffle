package com.dzalex.skillshuffle.dtos;

import com.dzalex.skillshuffle.enums.AttachmentType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostAttachmentDTO {
    private String url;
    private AttachmentType type;
}
