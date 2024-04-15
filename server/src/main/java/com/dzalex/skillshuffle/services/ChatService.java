package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.*;
import com.dzalex.skillshuffle.entities.*;
import com.dzalex.skillshuffle.enums.ChatType;
import com.dzalex.skillshuffle.enums.MemberRole;
import com.dzalex.skillshuffle.repositories.ChatMemberRepository;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.repositories.CommunityChatRepository;
import com.dzalex.skillshuffle.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

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

    public List<ChatPreviewDTO> getChatList() {
        List<Chat> chats = chatRepository.findAll();
        List<ChatPreviewDTO> chatPreviewDTOs = new ArrayList<>();

        for (Chat chat : chats) {

            // Check if the current user is a member of the chat
            String authedUsername = userService.getCurrentUser().getUsername();

            ChatPreviewDTO chatPreviewDTO = new ChatPreviewDTO();
            if (chat.getType() == ChatType.COMMUNITY) {
                // TODO: Implement community chat preview
            } else {
                if (!userService.getUsersInChat(chat.getId()).contains(authedUsername)) {
                    continue;
                }
            }

            // Get the last message of the chat
            MessageDTO lastMessage = messageService.findLastMessageByChatId(chat.getId());

            // Populate the DTO with chat information and last message
            chatPreviewDTO.setId(chat.getId());
            chatPreviewDTO.setName(chat.getName());
            chatPreviewDTO.setType(chat.getType());
            chatPreviewDTO.setAvatarUrl(chat.getAvatarUrl());
            chatPreviewDTO.setLastMessage(lastMessage);

            chatPreviewDTOs.add(chatPreviewDTO);
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

    // Get chat info
    public ChatDTO getChatInfo(Chat chat) {
        User authedUser = userService.getCurrentUser();
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setId(chat.getId());
        chatDTO.setType(chat.getType());

        switch (chat.getType()) {
            case COMMUNITY:
                CommunityChat communityChat = communityChatRepository.findCommunityChatByChatId(chat.getId());
                CommunityPreviewDTO community = communityService.convertToPreviewDTO(communityChat.getCommunity());
                chatDTO.setCommunity(community);
                chatDTO.setAvatarUrl(community.getAvatarUrl());
                chatDTO.setName(community.getName());
                break;
            case PRIVATE:
                chatMemberRepository.findAllByChatId(chat.getId()).forEach(chatMember -> {
                    if (!chatMember.getMember().getUsername().equals(authedUser.getUsername())) {
                        User chatPartner = chatMember.getMember();
                        chatDTO.setUser(userService.getPublicUserDTO(chatPartner));
                        chatDTO.setAvatarUrl(chatPartner.getAvatarUrl());
                        chatDTO.setName(chatPartner.getFirstName() + " " + chatPartner.getLastName());
                    }
                });
                break;
            case GROUP:
                chatDTO.setMemberCount(userService.getUsersInChat(chat.getId()).size());
                chatDTO.setAvatarUrl(chat.getAvatarUrl());
                chatDTO.setName(chat.getName());
                break;
        }

        return chatDTO;
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
            newChat.setAvatarUrl(avatarFilePath + mediaService.uploadImage(avatarBlob, avatarFilePath));
            chatRepository.save(newChat);
        }

        // Add the current user to the chat
        addMemberToChat(newChat, userService.getCurrentUser(), getRoleByChatType(chat.getType()));

        // Add members to the chat
        Arrays.stream(chat.getMembers())
              .map(userService::getUserByNickname)
              .forEach(user -> addMemberToChat(newChat, user, MemberRole.MEMBER));

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
}
