package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.*;
import com.dzalex.skillshuffle.entities.*;
import com.dzalex.skillshuffle.enums.ChatAnnouncementType;
import com.dzalex.skillshuffle.enums.ChatType;
import com.dzalex.skillshuffle.enums.MemberRole;
import com.dzalex.skillshuffle.enums.MessageType;
import com.dzalex.skillshuffle.repositories.ChatMemberRepository;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.repositories.CommunityChatRepository;
import com.dzalex.skillshuffle.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    private CommunityChatRepository communityChatRepository;

    @Autowired
    private CommunityService communityService;

    @Autowired
    private ChatMemberRepository chatMemberRepository;

    @Autowired
    private MediaService mediaService;

    @Autowired
    private FileService fileService;

    public List<ChatPreviewDTO> getChatList() {
        User authedUser = userService.getCurrentUser();
        List<Chat> chats = chatRepository.findAll();
        List<ChatPreviewDTO> chatPreviewDTOs = new ArrayList<>();

        for (Chat chat : chats) {
            // Check if the authenticated user is a member of the chat
            List<ChatMember> chatMembers = chatMemberRepository.findAllByChatId(chat.getId());
            boolean isUserMember = chatMembers.stream()
                    .anyMatch(chatMember -> chatMember.getMember().getId().equals(authedUser.getId()));


            if (isUserMember) {
                // Get chat info based on the chat type
                ChatDTO chatInfo = getChatInfo(chat);

                ChatPreviewDTO chatPreviewDTO = new ChatPreviewDTO();
                chatPreviewDTO.setId(chat.getId());
                chatPreviewDTO.setType(chat.getType());
                chatPreviewDTO.setName(chatInfo.getName());
                chatPreviewDTO.setAvatarUrl(chatInfo.getAvatarUrl());
                chatPreviewDTO.setLastMessage(messageService.findLastMessageByChatId(chat.getId()));

                chatPreviewDTOs.add(chatPreviewDTO);
            }
        }

        return chatPreviewDTOs;
    }

    public ChatDTO getChatWithMessages(Chat chat) {
        // Get chat info depending on the chat type
        ChatDTO chatDTO = getChatInfo(chat);

        // Load only 30 last messages
        chatDTO.setMessages(getChatMessages(chat.getId(), 30, 0));

        return chatDTO;
    }

    // Get chat messages with limit and offset parameters
    public List<MessageDTO> getChatMessages(Integer chatId, int limit, int offset) {
        List<ChatMessage> messages = messageRepository.findMessagesByChatId(chatId);
        List<MessageDTO> messageDTOs = new ArrayList<>();

        // Sort messages by latest timestamp
        messages.sort(Comparator.comparing(ChatMessage::getTimestamp).reversed());

        // Add messages to the list with limit and offset
        for (int i = offset; i < messages.size() && i < offset + limit; i++) {
            messageDTOs.add(messageService.convertToDTO(messages.get(i)));
        }

        // Sort messages by timestamp in ascending order
        messageDTOs.sort(Comparator.comparing(MessageDTO::getTimestamp));

        return messageDTOs;
    }

    public ChatDTO getChatInfo(Chat chat) {
        User authedUser = userService.getCurrentUser();
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setId(chat.getId());
        chatDTO.setType(chat.getType());

        switch (chat.getType()) {
            case COMMUNITY -> setCommunityChatInfo(chat, authedUser, chatDTO);
            case PRIVATE -> setPrivateChatInfo(chat, authedUser, chatDTO);
            case GROUP -> setGroupChatInfo(chat, chatDTO);
        }

        return chatDTO;
    }

    private void setCommunityChatInfo(Chat chat, User authedUser, ChatDTO chatDTO) {
        CommunityChat communityChat = communityChatRepository.findCommunityChatByChatId(chat.getId());
        if (communityChat != null && Objects.equals(communityChat.getUser().getId(), authedUser.getId())) {
            CommunityPreviewDTO community = communityService.convertToPreviewDTO(communityChat.getCommunity());
            chatDTO.setAvatarUrl(community.getAvatarUrl());
            chatDTO.setName(community.getName());
        }
    }

    private void setPrivateChatInfo(Chat chat, User authedUser, ChatDTO chatDTO) {
        chatMemberRepository.findAllByChatId(chat.getId()).stream()
            .filter(chatMember -> !chatMember.getMember().getUsername().equals(authedUser.getUsername()))
            .findFirst()
            .ifPresent(chatMember -> {
                User chatPartner = chatMember.getMember();
                chatDTO.setAvatarUrl(chatPartner.getAvatarUrl());
                chatDTO.setName(chatPartner.getFirstName() + " " + chatPartner.getLastName());
                chatDTO.setChatPartner(userService.getPublicUserDTO(chatPartner));
            });
    }

    private void setGroupChatInfo(Chat chat, ChatDTO chatDTO) {
        chatDTO.setMemberCount(userService.getUsersInChat(chat.getId()).size());
        chatDTO.setAvatarUrl(chat.getAvatarUrl());
        chatDTO.setName(chat.getName());
    }

    // Create a new chat
    public Chat createChat(NewChatDTO chat, MultipartFile avatarBlob) throws IOException {
        Chat newChat = Chat.builder()
                .name(chat.getName())
                .type(chat.getType())
                .avatarUrl(null)
                .build();
        chatRepository.save(newChat);

        // Save the avatar image if provided
        if (avatarBlob != null) {
            String avatarFilePath = "chats/chat-" + newChat.getId() + "/avatar/";
            // Upload the image to the S3 bucket
            String avatarUrl = fileService.uploadFile(avatarBlob, avatarFilePath);
            if (avatarUrl != null) {
                newChat.setAvatarUrl(avatarUrl);
            }
            chatRepository.save(newChat);
        }

        User authedUser = userService.getCurrentUser();

        // Add the current user to the chat
        addMemberToChat(newChat, authedUser, getRoleByChatType(chat.getType()));

        // Add members to the chat
        Arrays.stream(chat.getMembers())
              .map(userService::getUserByNickname)
              .forEach(user -> addMemberToChat(newChat, user, MemberRole.MEMBER));

        // Send ENTRY message to the chat
        if (chat.getType() == ChatType.GROUP) {
            messageService.createAnnouncementMessage(authedUser, newChat, ChatAnnouncementType.CREATED);
        } else {
            messageService.createEntryMessage(authedUser, newChat);
        }

        return newChat;
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

    @Transactional
    public void deleteEmptyChatsByAuthedUser(User authedUser) {
        // Delete chats with only one ENTRY type message
        chatRepository.findAll().forEach(chat -> {
            List<ChatMessage> messages = messageRepository.findMessagesByChatId(chat.getId());
            if (messages.size() == 1 && messages.get(0).getType() == MessageType.ENTRY
                    && Objects.equals(messages.get(0).getSender().getId(), authedUser.getId()))
            {
                if (chat.getType() == ChatType.COMMUNITY) {
                    communityChatRepository.deleteAllByChatId(chat.getId());
                } else {
                    chatMemberRepository.deleteAllByChatId(chat.getId());
                }
                messageRepository.delete(messages.get(0));
                chatRepository.delete(chat);
            }
        });
    }
}
