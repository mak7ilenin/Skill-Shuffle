package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.AuthRequestDTO;
import com.dzalex.skillshuffle.dtos.ChatMemberDTO;
import com.dzalex.skillshuffle.dtos.JwtResponseDTO;
import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.entities.ChatMember;
import com.dzalex.skillshuffle.entities.Friendship;
import com.dzalex.skillshuffle.entities.RefreshToken;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.repositories.ChatMemberRepository;
import com.dzalex.skillshuffle.repositories.FriendshipRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Service
public class UserService {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private JwtHelper helper;

    @Autowired
    private ChatMemberRepository chatMemberRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private FileService fileService;

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public boolean checkNicknameDuplicate(String nickname) {
        return userRepo.findByNickname(nickname) != null;
    }

    public boolean checkUserDuplicate(String username, String email) {
        return userRepo.findByUsername(username) != null || (email != null && userRepo.findByEmail(email) != null);
    }

    public User saveUser(User user, MultipartFile avatarBlob) {
        user.setPassword(passwordEncoder().encode(user.getPassword()));
        User savedUser = userRepo.save(user);
        User updatedUser = saveAvatar(savedUser, avatarBlob);
        return updatedUser != null ? updatedUser : savedUser;
    }

    public JwtResponseDTO authenticateUser(AuthRequestDTO request, HttpServletResponse response) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        if (userDetails != null) {
            // If user clicked remember me, create refresh token and save it in the database and in the cookie
            if (request.isRememberMe()) {
                RefreshToken refreshToken = refreshTokenService.generateRefreshToken(request.getUsername());
                helper.createRefreshTokenCookie(response, refreshToken);
            }

            // Create access token and save it in the cookie
            String accessToken = helper.createAccessTokenCookie(response, userDetails);

            User user = userRepo.findByUsername(request.getUsername());
            return JwtResponseDTO.builder()
                    .username(request.getUsername())
                    .accessToken(accessToken)
                    .user(getPublicUserDTO(user))
                    .build();
        }
        return null;
    }

    public JwtResponseDTO confirmAuthentication(HttpServletRequest request) {
        String token = helper.getAccessTokenFromCookies(request);
        if (token != null) {
            String username = helper.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (helper.validateToken(token, userDetails)) {
                User user = userRepo.findByUsername(username);
                user.setLastSeen(new Timestamp(System.currentTimeMillis()));
                userRepo.save(user);

                return JwtResponseDTO.builder()
                        .username(userDetails.getUsername())
                        .accessToken(token)
                        .user(getPublicUserDTO(user))
                        .build();
            }
        }
        return null;
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        // Invalidate session and clear authentication
        request.getSession().invalidate();
        SecurityContextHolder.clearContext();

        // Clear access and refresh tokens from the cookies
        helper.deleteAccessTokenCookie(response);
        String refreshToken = helper.getRefreshTokenFromCookies(request);
        if (refreshToken != null) {
            refreshTokenService.deleteByToken(refreshToken);
            helper.deleteRefreshTokenCookie(response);
        }
    }

    public void doAuthenticate(String username, String password) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, password);
        try {
            manager.authenticate(authentication);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid Username or Password!");
        }
    }

    private User saveAvatar(User user, MultipartFile avatarBlob) {
        if (avatarBlob != null) {
            String avatarFilePath = "users/user-" + user.getId() + "/avatar/";
            String avatarUrl = fileService.uploadFile(avatarBlob, avatarFilePath);
            if (avatarUrl != null) {
                user.setAvatarUrl(avatarUrl);
                return userRepo.save(user);
            }
        }
        return null;
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
                users.add(getChatMemberDTO(chatMember));
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
                    User friend = getFriendFromFriendship(friendship, user);
                    if (friend != null) {
                        friends.add(getPublicUserDTO(friend));
                    }
                });
        return friends;
    }

    public User getFriendFromFriendship(Friendship friendship, User authUser) {
        return Stream.of(friendship.getFriend(), friendship.getUser())
                .map(user -> userRepo.findById(user.getId()).orElse(null))
                .filter(user -> user != null && !Objects.equals(user.getId(), authUser.getId()))
                .findFirst()
                .orElse(null);
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

    public ChatMemberDTO getChatMemberDTO(ChatMember chatMember) {
        return ChatMemberDTO.builder()
                .firstName(chatMember.getMember().getFirstName())
                .lastName(chatMember.getMember().getLastName())
                .nickname(chatMember.getMember().getNickname())
                .avatarUrl(chatMember.getMember().getAvatarUrl())
                .role(chatMember.getRole())
                .lastSeen(chatMember.getMember().getLastSeen())
                .build();
    }

    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandler() {
        return "Credentials Invalid!";
    }
}
