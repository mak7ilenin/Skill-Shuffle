package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.*;
import com.dzalex.skillshuffle.entities.*;
import com.dzalex.skillshuffle.enums.FriendRequestStatus;
import com.dzalex.skillshuffle.enums.RelationshipStatus;
import com.dzalex.skillshuffle.repositories.ChatMemberRepository;
import com.dzalex.skillshuffle.repositories.FriendRequestRepository;
import com.dzalex.skillshuffle.repositories.FriendshipRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
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
    private FriendRequestRepository friendRequestRepository;

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

    private MessageService messageService;

    @Autowired
    private PostService postService;

    @Autowired
    @Lazy
    public void setMessageService(MessageService messageService) {
        this.messageService = messageService;
    }

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandler() {
        return "Credentials Invalid!";
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
                    .user(getAuthUserDTO(user))
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
                        .user(getAuthUserDTO(user))
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
            if (!chatMember.isLeft() && !chatMember.isKicked()) {
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
            if (!chatMember.isLeft() && !chatMember.isKicked()) {
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

    public Friendship getFriendship(User user, User authUser) {
        Friendship friendship = friendshipRepository.findByUserIdAndFriendId(user.getId(), authUser.getId());
        if (friendship == null) {
            friendship = friendshipRepository.findByUserIdAndFriendId(authUser.getId(), user.getId());
        }
        return friendship;
    }

    public boolean isFriend(User user, User authUser) {
        return getFriendship(user, authUser) != null;
    }

    public boolean isFollowed(User user, User authUser) {
        return friendRequestRepository.findBySenderIdAndReceiverId(authUser.getId(), user.getId()) != null;
    }

    public boolean isFollower(User user, User authUser) {
        return friendRequestRepository.findBySenderIdAndReceiverId(user.getId(), authUser.getId()) != null;
    }

    private RelationshipStatus getRelationshipStatus(User user, User authUser) {
        if (isFriend(user, authUser)) {
            return RelationshipStatus.FRIEND;
        } else if (isFollowed(user, authUser)) {
            return RelationshipStatus.FOLLOWING;
        } else if (isFollower(user, authUser)) {
            return RelationshipStatus.FOLLOWER;
        } else {
            return RelationshipStatus.NONE;
        }
    }

    public PublicUserDTO getPublicUserDTO(User user) {
        return PublicUserDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .lastSeen(user.getLastSeen())
                .isPublic(user.isPublic())
                .build();
    }

    public AuthUserDTO getAuthUserDTO(User user) {
        return AuthUserDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .unreadMessages(messageService.getUnreadMessagesCount(user.getId()))
                .build();
    }

    private SearchedUserDTO getSearchedUserDTO(User user, User authUser) {
        return SearchedUserDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .relationship(getRelationshipStatus(user, authUser))
                .autoFollow(user.isAutoFollow())
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

    public List<SearchedUserDTO> searchUsers(String query) {
        List<User> users = userRepo.searchUsers(query);
        List<SearchedUserDTO> searchedUsers = new ArrayList<>();

        User authUser = getCurrentUser();
        users.forEach(user -> {
            if (user.isPublic() && !Objects.equals(user.getId(), authUser.getId())) {
                searchedUsers.add(getSearchedUserDTO(user, authUser));
            }
        });

        return searchedUsers;
    }

    private FriendRequest getAcceptedFriendRequest(User sender, User receiver) {
        FriendRequest friendRequest = friendRequestRepository.findBySenderIdAndReceiverIdAndStatus(sender.getId(), receiver.getId(), FriendRequestStatus.ACCEPTED);
        if (friendRequest == null) {
            friendRequest = friendRequestRepository.findBySenderIdAndReceiverIdAndStatus(receiver.getId(), sender.getId(), FriendRequestStatus.ACCEPTED);
        }
        return friendRequest;
    }

    public SearchedUserDTO addUserRelationship(RelationshipActionDTO relationship) {
        User authUser = getCurrentUser();
        User user = getUserByNickname(relationship.getNickname());
        if (user != null) {
            if (authUser.getId().equals(user.getId())) {
                return null;
            }

            switch (relationship.getAction()) {
                case ADD_FRIEND:
                    addFriend(authUser, user);
                    break;
                case UNFRIEND:
                    removeFriend(authUser, user);
                    break;
                case FOLLOW:
                    followUser(authUser, user);
                    break;
                case UNFOLLOW:
                    unfollowUser(authUser, user);
                    break;
            }

            return getSearchedUserDTO(user, authUser);
        }

        return null;
    }

    private void addFriend(User authUser, User user) {
        if (!isFriend(user, authUser)) {
            if (isFollower(user, authUser)) {
                acceptFriendRequest(user, authUser);
            } else {
                sendFriendRequest(authUser, user);
            }
        }
    }

    private void sendFriendRequest(User sender, User receiver) {
        FriendRequest friendRequest = FriendRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .status(FriendRequestStatus.PENDING)
                .build();
        friendRequestRepository.save(friendRequest);
    }

    private void acceptFriendRequest(User sender, User receiver) {
        FriendRequest friendRequest = friendRequestRepository.findBySenderIdAndReceiverId(sender.getId(), receiver.getId());
        if (friendRequest != null) {
            friendRequest.setStatus(FriendRequestStatus.ACCEPTED);
            friendRequestRepository.save(friendRequest);

            Friendship friendship = Friendship.builder()
                    .user(sender)
                    .friend(receiver)
                    .build();
            friendshipRepository.save(friendship);
        }
    }

    private void removeFriend(User authUser, User user) {
        Friendship friendship = getFriendship(user, authUser);
        if (friendship != null) {
            friendshipRepository.delete(friendship);

            // Remove the accepted friend request if it exists
            FriendRequest friendRequest = getAcceptedFriendRequest(authUser, user);
            if (friendRequest != null) {
                friendRequestRepository.delete(friendRequest);
            }
        }
    }

    private void followUser(User authUser, User user) {
        if (!isFollowed(user, authUser)) {
            FriendRequest friendRequest = FriendRequest.builder()
                    .sender(authUser)
                    .receiver(user)
                    .status(FriendRequestStatus.PENDING)
                    .build();
            friendRequestRepository.save(friendRequest);
        }
    }

    private void unfollowUser(User authUser, User user) {
        FriendRequest friendRequest = friendRequestRepository.findBySenderIdAndReceiverId(authUser.getId(), user.getId());
        if (friendRequest != null) {
            friendRequestRepository.delete(friendRequest);
        }
    }

    private List<PublicUserDTO> getUserFollowers(User user) {
        return friendRequestRepository.findAllBySenderId(user.getId()).stream()
                .map(friendRequest -> getPublicUserDTO(friendRequest.getSender()))
                .toList();
    }

    public UserProfileDTO getUserProfileData(User user) {
        List<PublicUserDTO> friends = getUserFriends(user);
        return UserProfileDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .nickname(user.getNickname())
                .gender(user.getGender())
                .birthDate(user.getBirthDate())
                .bio(user.getBio())
                .points(user.getPoints())
                .avatarUrl(user.getAvatarUrl())
                .bannerUrl(user.getBannerUrl())
                .bannerColor(user.getBannerColor())
                .isPublic(user.isPublic())
                .autoFollow(user.isAutoFollow())
                .lastSeen(user.getLastSeen())
                .joinedAt(user.getCreatedAt())
                .followersCount(getUserFollowers(user).size())
                .friends(friends)
                .posts(postService.getUserPosts(user))
                .build();
    }
}
