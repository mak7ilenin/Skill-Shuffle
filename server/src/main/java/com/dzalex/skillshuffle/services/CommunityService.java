package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.CommunityPreviewDTO;
import com.dzalex.skillshuffle.entities.Community;
import org.springframework.stereotype.Service;

@Service
public class CommunityService {

    public CommunityPreviewDTO convertToPreviewDTO(Community community) {
        return CommunityPreviewDTO.builder()
                .name(community.getName())
                .nickname(community.getNickname())
                .description(community.getDescription())
                .avatarUrl(community.getAvatarUrl())
                .build();
    }
}
