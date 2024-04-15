package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.CommunityPreviewDTO;
import com.dzalex.skillshuffle.entities.Community;
import com.dzalex.skillshuffle.entities.CommunityChat;
import com.dzalex.skillshuffle.repositories.CommunityChatRepository;
import com.dzalex.skillshuffle.repositories.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommunityService {

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private UserService userService;

    @Autowired
    CommunityChatRepository communityChatRepository;

    public CommunityPreviewDTO convertToPreviewDTO(Community community) {
        return CommunityPreviewDTO.builder()
                .name(community.getName())
                .nickname(community.getNickname())
                .description(community.getDescription())
                .avatarUrl(community.getAvatarUrl())
                .build();
    }
}
