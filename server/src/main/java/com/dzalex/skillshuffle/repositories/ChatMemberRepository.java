package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.models.ChatMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {
    List<ChatMember> findAllByChatId(Long chatId);
}
