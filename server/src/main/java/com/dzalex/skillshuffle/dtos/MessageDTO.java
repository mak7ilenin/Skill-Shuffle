package com.dzalex.skillshuffle.dtos;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageDTO {
    private Long id;
    private String content;
    private Timestamp timestamp;
}