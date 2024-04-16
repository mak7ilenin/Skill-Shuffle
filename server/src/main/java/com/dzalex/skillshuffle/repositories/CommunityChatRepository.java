package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.CommunityChat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityChatRepository extends JpaRepository<CommunityChat, Integer> {
    CommunityChat findCommunityChatByChatId(Integer id);
    void deleteAllByChatId(Integer id);
}
