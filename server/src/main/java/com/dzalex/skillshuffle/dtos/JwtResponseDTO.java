package com.dzalex.skillshuffle.dtos;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtResponseDTO {
    private String accessToken;
    private String username;
    private PublicUserDTO user;
}