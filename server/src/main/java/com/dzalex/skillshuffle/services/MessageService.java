package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.ChatNotificationDTO;
import com.dzalex.skillshuffle.dtos.MessageDTO;
import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.entities.Chat;
import com.dzalex.skillshuffle.entities.ChatMember;
import com.dzalex.skillshuffle.enums.*;
import com.dzalex.skillshuffle.entities.ChatMessage;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.repositories.ChatMemberRepository;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.repositories.MessageRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatMemberRepository chatMemberRepository;

    private UserService userService;

    @Autowired
    @Lazy
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    private SessionService sessionService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ChatMessage saveMessage(ChatMessage message, Integer chatId, User sender) {
        // Create a new message and set its attributes
        ChatMessage savedMessage = ChatMessage.builder()
                .sender(sender)
                .chat(chatRepository.findChatById(chatId))
                .content(message.getContent())
                .timestamp(new Timestamp(System.currentTimeMillis()))
                .type(MessageType.MESSAGE)
                .build();

        // Save the message to the database
        return messageRepository.save(savedMessage);
    }

    public void sendMessage(ChatMessage message) {
        Integer chatId = message.getChat().getId();
        User sender = userRepository.findByNickname(message.getSender().getNickname());

        if (!userService.getUsernamesInChat(chatId).contains(sender.getUsername())) {
            throw new IllegalArgumentException("User is not a member of this chat");
        }

        // Save the message to the database
        if (message.isAnnouncement()) {
            messageRepository.save(message);
        } else {
            message = saveMessage(message, chatId, sender);
        }

        returnMessageToUsers(message, sender);
    }

    private void returnMessageToUsers(ChatMessage message, User sender) {
        Integer chatId = message.getChat().getId();
        List<String> usernames = userService.getUsernamesInChat(chatId);

        for (String username : usernames) {
            if (sessionService.isConnectionActive(username)) {

                // Send the message to all users who subscribed to chat
                if (sessionService.isUserSubscribed(username, "/user/chat/" + chatId)) {
                    messagingTemplate.convertAndSendToUser(username, "/chat/" + chatId, convertToDTO(message));
                    continue;
                }

                // Generate notification for the user
                ChatNotificationDTO notification = generateMessageNotification(chatId, message, userService.getPublicUserDTO(sender));

                // Send new message notification to the user, for the chat list
                if (sessionService.isUserSubscribed(username, "/user/chat")) {
                    Object[] notificationAndMessage = {notification, convertToDTO(message)};
                    messagingTemplate.convertAndSendToUser(username, "/chat", notificationAndMessage);
                    continue;
                }

                // Send notification to user who is currently not subscribed to any chat endpoint
                ChatMember chatMember = chatMemberRepository.findFirstByChatIdAndMemberUsername(chatId, username);
                if (chatMember != null && chatMember.hasNotifications()) {
                    messagingTemplate.convertAndSendToUser(username, "/notification", notification);
                }
            }
        }
    }

    // Create new message notification based on chat type
    public ChatNotificationDTO generateMessageNotification(Integer chatId, ChatMessage message, PublicUserDTO sender) {
        String notificationMessage;
        Chat chat = chatRepository.findChatById(chatId);

        if (chat.isPrivate()) {
            notificationMessage = sender.getFirstName() + " sent you a message";
        } else {
            notificationMessage = "New message in " + chat.getName();
        }

        // Return notification object
        return new ChatNotificationDTO(
                chat,
                sender,
                notificationMessage,
                message.getContent(),
                NotificationType.CHAT_MESSAGE
        );
    }

    public MessageDTO findChatLastMessage(Chat chat) {
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chat.getId(), userService.getCurrentUser().getId());
        List<MessageDTO> messages = getChatMessages(chat.getId(), chatMember, -1, 0);

        // Check if messages list is not empty
        if (!messages.isEmpty()) {

            // Reverse the list to get the last message
            messages = messages
                    .stream()
                    .sorted(Comparator.comparing(MessageDTO::getTimestamp).reversed())
                    .toList();

            // Check if the chat is a group and the current user is left the chat
            if (chat.isGroup() && chatMember.isLeft()) {
                // Get last message that sent by authedUser with type ANNOUNCEMENT
                return messages.stream()
                        .filter(message -> message.getSender().getNickname().equals(chatMember.getMember().getNickname()) && message.isAnnouncement())
                        .findFirst()
                        .orElse(messages.get(0));
            }

            // If user cleared the chat, and there are no messages after that, don't return a message
            if (chatMember.getClearedAt() != null && messages.get(0).getTimestamp().before(chatMember.getClearedAt())) {
                return null;
            }

            // Return the last message as a DTO
            return messages.get(0);
        }
        return null;
    }

    public MessageDTO convertToDTO(ChatMessage message) {
        return new MessageDTO(
                message.getId(),
                message.getChat().getId(),
                userService.getPublicUserDTO(message.getSender()),
                message.getContent(),
                message.getTimestamp(),
                message.getType());
    }

    public void createEntryMessage(User sender, Chat chat) {
        ChatMessage entryMessage = ChatMessage.builder()
                .sender(sender)
                .chat(chat)
                .content(sender.getFirstName() + " " + sender.getLastName() + " has entered the chat")
                .timestamp(new Timestamp(System.currentTimeMillis()))
                .type(MessageType.ENTRY)
                .build();
        messageRepository.save(entryMessage);
    }

    public void createAnnouncementMessage(User sender, Chat chat, ChatAnnouncementType announcementType, User user) {
        ChatMessage announcementMessage = ChatMessage.builder()
                .sender(sender)
                .chat(chat)
                .content(getAnnouncementMessageContent(sender, chat, announcementType, user))
                .timestamp(new Timestamp(System.currentTimeMillis()))
                .type(MessageType.ANNOUNCEMENT)
                .build();

        // Send the announcement message to websocket endpoint
        sendMessage(announcementMessage);
    }

    private String getAnnouncementMessageContent(User sender, Chat chat, ChatAnnouncementType announcementType, User user) {
        String userNameTemplate = "<a href='/users?nn=%s'>%s %s</a>";
        String senderName = userNameTemplate.formatted(sender.getNickname(), sender.getFirstName(), sender.getLastName());
        String userName = "anonymous";
        if (user != null) {
            userName = userNameTemplate.formatted(user.getNickname(), user.getFirstName(), user.getLastName());
        }
        return switch (announcementType) {
            case LEFT -> senderName + " left the chat";
            case CREATED -> senderName + " created '<i>" + chat.getName() + "</i>'";
            case REMOVED -> senderName + " kicked " + userName;
            case RETURNED -> senderName + " returned to the chat";
            case ADDED -> senderName + " added " + userName;
        };
    }

    public int getChatUnreadMessages(Integer chatId, Integer userId) {
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chatId, userId);
        if (chatMember == null) {
            throw new IllegalArgumentException("User is not a member of this chat");
        }

        if (chatMember.getClosedAt() == null) {
            return (int) messageRepository.findMessagesByChatId(chatId)
                    .stream()
                    .filter(message -> message.getTimestamp().after(chatMember.getJoinedAt()))
                    .filter(message -> !message.isEntry())
                    .count();
        }

        return (int) messageRepository.findMessagesByChatId(chatId)
                .stream()
                .filter(message -> message.getType() != MessageType.ENTRY)
                .filter(message -> message.getTimestamp().after(chatMember.getClosedAt()))
                .count();
    }

    public int getUnreadMessagesCount(Integer userId) {
        return chatMemberRepository.findChatMembersByMemberId(userId)
                .stream()
                .mapToInt(chatMember -> getChatUnreadMessages(chatMember.getChat().getId(), userId))
                .sum();
    }

    public List<MessageDTO> getChatMessages(Integer chatId, ChatMember chatMember, int limit, int offset) {
        if (offset < 0) {
            throw new IllegalArgumentException("Offset must be non-negative");
        }

        if (chatMember != null) {
            return messageRepository.findMessagesByChatId(chatId)
                    .stream()
                    .filter(message -> !chatMember.isLeft() || message.getTimestamp().before(chatMember.getLeftAt()))
                    .filter(message -> !chatMember.isCleared() || message.getTimestamp().after(chatMember.getClearedAt()))
                    .sorted(Comparator.comparing(ChatMessage::getTimestamp).reversed())
                    .skip(offset)
                    .limit(limit > 0 ? limit : Long.MAX_VALUE)
                    .map(this::convertToDTO)
                    .sorted(Comparator.comparing(MessageDTO::getTimestamp))
                    .toList();
        }

        return new ArrayList<>();
    }
}
