package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.ChatMember;
import com.dzalex.skillshuffle.enums.MemberRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

public interface ChatMemberRepository extends JpaRepository<ChatMember, Integer> {
    List<ChatMember> findAllByChatId(Integer chatId);

    void deleteAllByChatId(Integer id);

    ChatMember findChatMemberByChatIdAndMemberId(Integer id, Integer id1);

    @Transactional
    ChatMember findFirstByChatIdAndMemberUsername(Integer id, String username);

    ChatMember findFirstByChatIdAndMemberNickname(Integer id, String nickname);

    ChatMember findFirstByChatIdAndRole(Integer id, MemberRole memberRole);

    List<ChatMember> findChatMembersByMemberId(Integer userId);

    List<ChatMember> findAllByMemberId(Integer id);
}
