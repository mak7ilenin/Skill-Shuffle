package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.ChatMemberDTO;
import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.entities.ChatMember;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.enums.MemberRole;
import com.dzalex.skillshuffle.repositories.ChatMemberRepository;
import com.dzalex.skillshuffle.repositories.FriendshipRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ChatMemberRepository chatMemberRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

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

    public User getUserByNickname(String nickname) {
        return userRepo.findByNickname(nickname);
    }

    @Transactional
    public List<ChatMemberDTO> getUsersInChat(Integer chatId) {
        List<ChatMember> chatMembers = chatMemberRepository.findAllByChatId(chatId);
        List<ChatMemberDTO> users = new ArrayList<>();
        for (ChatMember chatMember : chatMembers) {
            if (chatMember.getLeftAt() == null) {
                users.add(getChatMemberDTO(chatMember.getMember(), chatMember.getRole()));
            }
        }
        return users;
    }

    @Transactional
    public List<String> getUsernamesInChat(Integer chatId) {
        List<ChatMember> chatMembers = chatMemberRepository.findAllByChatId(chatId);
        List<String> usernames = new ArrayList<>();
        for (ChatMember chatMember : chatMembers) {
            if (!chatMember.isLeft()) {
                usernames.add(chatMember.getMember().getUsername());
            }
        }
        return usernames;
    }

    public List<String> getUsersFirstNameInChat(String[] members) {
        List<String> firstNames = new ArrayList<>();
        firstNames.add(getCurrentUser().getFirstName());
        for (String member : members) {
            User user = getUserByNickname(member);
            if (user != null) {
                firstNames.add(user.getFirstName());
            }
        }
        return firstNames;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && !(authentication instanceof AnonymousAuthenticationToken)) {
            String username = authentication.getName();
            return userRepo.findByUsername(username);
        }
        return null;
    }

    public List<PublicUserDTO> getUserFriends(User user) {
        List<PublicUserDTO> friends = new ArrayList<>();
        friendshipRepository.findByUserIdOrFriendId(user.getId(), user.getId())
                .forEach(friendship -> {
                    Optional<User> friendRef = userRepo.findById(friendship.getFriend().getId());
                    if (friendRef.isPresent() && !Objects.equals(friendRef.get().getId(), user.getId())) {
                        User friend = friendRef.get();
                        friends.add(getPublicUserDTO(friend));
                        return;
                    }
                    Optional<User> userRef = userRepo.findById(friendship.getUser().getId());
                    if (userRef.isPresent() && !Objects.equals(userRef.get().getId(), user.getId())) {
                        User friend = userRef.get();
                        friends.add(getPublicUserDTO(friend));
                    }
                });
        return friends;
    }

    public PublicUserDTO getPublicUserDTO(User user) {
        return PublicUserDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .lastSeen(user.getLastSeen())
                .build();
    }

    public ChatMemberDTO getChatMemberDTO(User user, MemberRole role) {
        return ChatMemberDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .lastSeen(user.getLastSeen())
                .role(role)
                .build();
    }
}
