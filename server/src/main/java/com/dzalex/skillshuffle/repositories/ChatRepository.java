package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.Chat;
import com.dzalex.skillshuffle.entities.ChatMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Integer> {
    Chat findChatById(Integer id);

    @Query("SELECT c FROM Chat c JOIN c.members m1 JOIN c.members m2 WHERE m1.member.id = :userId1 AND m2.member.id = :userId2 AND c.type = 'PRIVATE'")
    Chat findPrivateChatByUserIds(@Param("userId1") Integer userId1, @Param("userId2") Integer userId2);
}
