package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.*;
import com.dzalex.skillshuffle.entities.*;
import com.dzalex.skillshuffle.enums.ChatAnnouncementType;
import com.dzalex.skillshuffle.enums.ChatType;
import com.dzalex.skillshuffle.enums.MemberRole;
import com.dzalex.skillshuffle.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.*;

@Service
public class ChatService {

    @Autowired
    private MessageService messageService;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private CommunityService communityService;

    @Autowired
    private ChatMemberRepository chatMemberRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private SessionService sessionService;

    public List<ChatPreviewDTO> getChatList() {
        List<Chat> chats = chatRepository.findAll();
        List<ChatPreviewDTO> chatPreviewDTOs = new ArrayList<>();

        User authedUser = userService.getCurrentUser();
        for (Chat chat : chats) {
            ChatPreviewDTO chatPreviewDTO = getChatPreview(chat, authedUser);
            if (chatPreviewDTO != null) {
                chatPreviewDTO.setLastMessage(messageService.findChatLastMessage(chat));
                chatPreviewDTOs.add(chatPreviewDTO);
            }
        }
        return chatPreviewDTOs;
    }

    public ChatDTO getChatWithMessages(Chat chat) {
        User authedUser = userService.getCurrentUser();

        // Close previous chat
        String chatId = sessionService.getPreviouslySubscribedChatId(authedUser.getUsername());
        if (chatId != null) {
            closeChat(Integer.parseInt(chatId), authedUser.getUsername());
        }

        if (!isUserMemberOfChat(chat.getId(), authedUser.getId())) {
            throw new IllegalArgumentException("User is not a member of this chat");
        }

        return getChatInfo(chat);
    }

    // Get chat info based on the chat type
    public ChatDTO getChatInfo(Chat chat) {
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setId(chat.getId());
        chatDTO.setType(chat.getType());
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chat.getId(), userService.getCurrentUser().getId());
        chatDTO.setMessages(messageService.getFirstChatMessages(chat.getId(), chatMember));
        chatDTO.setMuted(isChatMuted(chat.getId(), chatMember.getMember().getId()));

        switch (chat.getType()) {
            case COMMUNITY -> getCommunityChatInfo(chat, chatDTO);
            case PRIVATE -> getPrivateChatInfo(chat, chatDTO);
            case GROUP -> getGroupChatInfo(chat, chatDTO);
        }

        return chatDTO;
    }

    private ChatPreviewDTO getChatPreview(Chat chat, User authedUser) {
        if (isUserMemberOfChat(chat.getId(), authedUser.getId())) {
            ChatPreviewDTO chatInfo = getShortChatInfo(chat);
            return ChatPreviewDTO.builder()
                    .id(chat.getId())
                    .type(chat.getType())
                    .name(chatInfo.getName())
                    .avatarUrl(chatInfo.getAvatarUrl())
                    .lastMessage(messageService.findChatLastMessage(chat))
                    .isMuted(isChatMuted(chat.getId(), authedUser.getId()))
                    .isOnline(chatInfo.isOnline())
                    .unreadMessages(messageService.getUnreadMessagesCount(chat.getId(), authedUser.getId()))
                    .build();
        }
        return null;
    }

    private ChatPreviewDTO getShortChatInfo(Chat chat) {
        ChatPreviewDTO chatDTO = new ChatPreviewDTO();
        switch (chat.getType()) {
            case COMMUNITY -> {
                chatDTO.setAvatarUrl(chat.getCommunity().getAvatarUrl());
                chatDTO.setName(chat.getCommunity().getName());
            }
            case PRIVATE -> chatMemberRepository.findAllByChatId(chat.getId()).stream()
                .filter(chatMember -> !chatMember.getMember().getUsername().equals(userService.getCurrentUser().getUsername()))
                .findFirst()
                .ifPresent(chatMember -> {
                    User chatPartner = chatMember.getMember();
                    chatDTO.setAvatarUrl(chatPartner.getAvatarUrl());
                    chatDTO.setName(chatPartner.getFirstName() + " " + chatPartner.getLastName());
                    chatDTO.setOnline(chatPartner.isOnline());
                });
            case GROUP -> {
                chatDTO.setAvatarUrl(chat.getAvatarUrl());
                chatDTO.setName(chat.getName());
            }
        }

        return chatDTO;
    }

    private void getCommunityChatInfo(Chat chat, ChatDTO chatDTO) {
        CommunityPreviewDTO community = communityService.convertToPreviewDTO(chat.getCommunity());
        chatDTO.setAvatarUrl(community.getAvatarUrl());
        chatDTO.setName(community.getName());
        chatDTO.setCommunity(community);
    }

    private void getPrivateChatInfo(Chat chat, ChatDTO chatDTO) {
        chatMemberRepository.findAllByChatId(chat.getId()).stream()
            .filter(chatMember -> !chatMember.getMember().getUsername().equals(userService.getCurrentUser().getUsername()))
            .findFirst()
            .ifPresent(chatMember -> {
                User chatPartner = chatMember.getMember();
                chatDTO.setAvatarUrl(chatPartner.getAvatarUrl());
                chatDTO.setName(chatPartner.getFirstName() + " " + chatPartner.getLastName());
                chatDTO.setMembers(List.of(userService.getChatMemberDTO(chatMember)));
            });
    }

    private void getGroupChatInfo(Chat chat, ChatDTO chatDTO) {
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chat.getId(), userService.getCurrentUser().getId());
        chatDTO.setMembers(!chatMember.isLeft() ? userService.getUsersInChat(chat.getId()) : null);
        chatDTO.setAvatarUrl(chat.getAvatarUrl());
        chatDTO.setName(chat.getName());
    }

    public Chat createChat(NewChatDTO chat, MultipartFile avatarBlob) {
        setChatNameIfEmpty(chat);
        Chat newChat = createAndSaveChat(chat);
        saveAvatarIfProvided(avatarBlob, newChat);
        User authedUser = userService.getCurrentUser();
        addMembersToChat(chat, newChat, authedUser);
        sendEntryMessage(chat, newChat, authedUser);
        return newChat;
    }

    private void setChatNameIfEmpty(NewChatDTO chat) {
        if (chat.getName().isEmpty() && chat.isGroup()) {
            List<String> firstNames = userService.getUsersFirstNameInChat(chat.getMembers());
            if (firstNames.size() > 3) {
                firstNames = firstNames.subList(0, 3);
                firstNames.add("and " + (firstNames.size() - 3) + " more");
            }
            chat.setName(String.join(", ", firstNames));
        }
    }

    private Chat createAndSaveChat(NewChatDTO chat) {
        Chat newChat = Chat.builder()
                .name(chat.getName())
                .type(chat.getType())
                .avatarUrl(null)
                .build();
        chatRepository.save(newChat);
        return newChat;
    }

    private void saveAvatarIfProvided(MultipartFile avatarBlob, Chat newChat) {
        if (avatarBlob != null) {
            String avatarFilePath = "chats/chat-" + newChat.getId() + "/avatar/";
            String avatarUrl = fileService.uploadFile(avatarBlob, avatarFilePath);
            if (avatarUrl != null) {
                newChat.setAvatarUrl(avatarUrl);
                chatRepository.save(newChat);
            }
        }
    }

    private void addMembersToChat(NewChatDTO chat, Chat newChat, User authedUser) {
        addMemberToChat(newChat, authedUser, getRoleByChatType(chat.getType()));
        Arrays.stream(chat.getMembers())
              .map(userService::getUserByNickname)
              .forEach(user -> addMemberToChat(newChat, user, MemberRole.MEMBER));
    }

    private void sendEntryMessage(NewChatDTO chat, Chat newChat, User authedUser) {
        if (chat.isGroup()) {
            messageService.createAnnouncementMessage(authedUser, newChat, ChatAnnouncementType.CREATED, null);
        } else {
            messageService.createEntryMessage(authedUser, newChat);
        }
    }

    private void addMemberToChat(Chat chat, User user, MemberRole role) {
        ChatMember chatMember = ChatMember.builder()
                .chat(chat)
                .member(user)
                .role(role)
                .notifications(true)
                .build();
        chatMemberRepository.save(chatMember);
    }

    private MemberRole getRoleByChatType(ChatType chatType) {
        return chatType == ChatType.GROUP ? MemberRole.CREATOR : MemberRole.MEMBER;
    }

    public boolean isUserMemberOfChat(Integer chatId, Integer userId) {
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chatId, userId);
        return chatMember != null;
    }

    private boolean isChatMuted(Integer chatId, Integer userId) {
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chatId, userId);
        return chatMember != null && !chatMember.hasNotifications();
    }

    @Transactional
    public void deleteEmptyChatsByAuthedUser(User authedUser) {
        // Delete chats with only one ENTRY type message
        chatRepository.findAll().forEach(chat -> {
            List<ChatMessage> messages = messageRepository.findMessagesByChatId(chat.getId());
            if (messages.size() == 1 && messages.get(0).isEntry()
                    && Objects.equals(messages.get(0).getSender().getId(), authedUser.getId()))
            {
                chatMemberRepository.deleteAllByChatId(chat.getId());
                messageRepository.delete(messages.get(0));
                chatRepository.delete(chat);
            }
        });
    }

    public void leaveChat(Chat chat) {
        User authedUser = userService.getCurrentUser();
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chat.getId(), authedUser.getId());

        if (chatMember != null && chat.isGroup()) {
            messageService.createAnnouncementMessage(authedUser, chat, ChatAnnouncementType.LEFT, null);
            chatMember.setLeftAt(new Timestamp(System.currentTimeMillis()));

            if (chatMember.isOwner()) {
                transferOwnership(chat);
                chatMember.setRole(MemberRole.MEMBER);
            }

            chatMemberRepository.save(chatMember);
            sessionService.removeSession(authedUser.getUsername(), "/user/chat/" + chat.getId());
        }
    }

    private void transferOwnership(Chat chat) {
        ChatMember newOwner = findNewOwner(chat);
        if (newOwner != null) {
            newOwner.setRole(MemberRole.CREATOR);
            chatMemberRepository.save(newOwner);
        }
    }

    private ChatMember findNewOwner(Chat chat) {
        ChatMember newOwner = chatMemberRepository.findFirstByChatIdAndRole(chat.getId(), MemberRole.ADMIN);
        if (newOwner == null) {
            newOwner = chatMemberRepository.findFirstByChatIdAndRole(chat.getId(), MemberRole.MEMBER);
        }
        return newOwner;
    }

    public ChatDTO returnToChat(Chat chat) {
        User authedUser = userService.getCurrentUser();
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chat.getId(), authedUser.getId());
        if (chatMember != null) {
            chatMember.setLeftAt(null);
            chatMemberRepository.save(chatMember);
            messageService.createAnnouncementMessage(authedUser, chat, ChatAnnouncementType.RETURNED, null);
            return getChatInfo(chat);
        }
        return null;
    }

    // Remove member from chat
    public void removeMemberFromChat(Chat chat, User user) {
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chat.getId(), user.getId());
        if (chatMember != null) {
            chatMemberRepository.delete(chatMember);
            messageService.createAnnouncementMessage(userService.getCurrentUser(), chat, ChatAnnouncementType.REMOVED, user);
        }
    }

    // Patch method to update chat avatar
    public Chat updateChatAvatar(Chat chat, MultipartFile avatarBlob) {
        String avatarFilePath = "chats/chat-" + chat.getId() + "/avatar/";
        String avatarUrl;
        if (chat.getAvatarUrl() == null) {
            avatarUrl = fileService.uploadFile(avatarBlob, avatarFilePath);
        } else {
            avatarUrl = fileService.changeFile(avatarBlob, avatarFilePath, chat.getAvatarUrl());
        }
        if (avatarUrl != null) {
            chat.setAvatarUrl(avatarUrl);
            return chatRepository.save(chat);
        }
        return null;
    }

    public ChatDTO inviteMembersToChat(Chat chat, List<String> users) {
        if (chat.isGroup()) {
            users.stream()
                 .map(userService::getUserByNickname)
                 .forEach(user -> {
                     addMemberToChat(chat, user, MemberRole.MEMBER);
                     messageService.createAnnouncementMessage(userService.getCurrentUser(), chat, ChatAnnouncementType.ADDED, user);
                 });
            return getChatInfo(chat);
        }
        return null;
    }

    @Transactional
    public List<PublicUserDTO> getFriendListForChat(Chat chat) {
        User authUser = userService.getCurrentUser();
        List<PublicUserDTO> friends = new ArrayList<>();
        List<String> chatMembers = userService.getUsernamesInChat(chat.getId());

        friendshipRepository.findByUserIdOrFriendId(authUser.getId(), authUser.getId())
                .forEach(friendship -> {
                    User friend = userService.getFriendFromFriendship(friendship, authUser);
                    if (friend != null && canAddFriendToChat(chat.getId(), authUser.getId(), friend.getId()) && !chatMembers.contains(friend.getUsername())) {
                        friends.add(userService.getPublicUserDTO(friend));
                    }
                });
        return friends;
    }

    private boolean canAddFriendToChat(Integer chatId, Integer userId, Integer friendId) {
        ChatMember authUserMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chatId, userId);
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chatId, friendId);
        return authUserMember != null && (chatMember == null || canAddExistingMemberBackToChat(authUserMember, chatMember));
    }

    private boolean canAddExistingMemberBackToChat(ChatMember authUserMember, ChatMember chatMember) {
        return !chatMember.isKicked() || (authUserMember.isOwner() && authUserMember.isAdmin());
    }

    public void updateChatNotifications(Chat chat, boolean state) {
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chat.getId(), userService.getCurrentUser().getId());
        if (chatMember != null) {
            chatMember.setNotifications(state);
            chatMemberRepository.save(chatMember);
        }
    }

    public void clearChatHistory(Chat chat) {
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chat.getId(), userService.getCurrentUser().getId());
        if (chatMember != null) {
            chatMember.setClearedAt(new Timestamp(System.currentTimeMillis()));
            chatMemberRepository.save(chatMember);
        }
    }

    public void closeChat(Integer chatId, String username) {
        ChatMember chatMember = chatMemberRepository.findFirstByChatIdAndMemberUsername(chatId, username);
        if (chatMember != null) {
            chatMember.setClosedAt(new Timestamp(System.currentTimeMillis()));
            chatMemberRepository.save(chatMember);
        }
    }
}
