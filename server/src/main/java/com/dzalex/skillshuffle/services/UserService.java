package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.AuthRequestDTO;
import com.dzalex.skillshuffle.entities.ChatMember;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.repositories.ChatMemberRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.authorization.AuthorizationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ChatMemberRepository chatMemberRepository;

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public boolean checkUserDuplicate(String username, String email) {
        User user = userRepo.findByUsername(username);
        User userByEmail = userRepo.findByEmail(email);
        return user != null || userByEmail != null;
    }

    public User saveUser(User user) {
        user.setPassword(passwordEncoder().encode(user.getPassword()));
        return userRepo.save(user);
    }

    @Transactional
    public List<String> getUsersInChat(Integer chatId) {
        List<ChatMember> chatMembers = chatMemberRepository.findAllByChatId(chatId);
        List<String> usernames = new ArrayList<>();
        for (ChatMember chatMember : chatMembers) {
            usernames.add(chatMember.getMember().getUsername());
        }
        return usernames;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            String username = authentication.getName();
            return userRepo.findByUsername(username);
        }
        return null;
    }
}
