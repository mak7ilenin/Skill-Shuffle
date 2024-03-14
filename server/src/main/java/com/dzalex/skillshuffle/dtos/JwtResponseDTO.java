package com.dzalex.skillshuffle.dtos;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtResponseDTO {
    private String access_token;
    private String username;
    private UserSessionDTO user;
}