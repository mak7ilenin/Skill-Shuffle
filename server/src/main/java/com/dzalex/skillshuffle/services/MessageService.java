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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
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

    @Autowired
    private UserService userService;

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
                .status(MessageStatus.SENT)
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

        returnMessageToUser(message, sender);
    }

    private void returnMessageToUser(ChatMessage message, User sender) {
        Integer chatId = message.getChat().getId();
        List<String> usernames = userService.getUsernamesInChat(chatId);

        for (String username : usernames) {
            if (sessionService.isUserSubscribed(username, "/user/chat/" + chatId)) {
                // Send the message to all users who subscribed to chat
                messagingTemplate.convertAndSendToUser(username, "/chat/" + chatId, convertToDTO(message));
            } else {
                // Generate notification for the user
                ChatNotificationDTO notification = generateMessageNotification(chatId, message, userService.getPublicUserDTO(sender));

                // Send new message notification to the user, for the chat list
                if (sessionService.isUserSubscribed(username, "/user/chat")) {
                    Object[] notificationAndMessage = {notification, convertToDTO(message)};
                    messagingTemplate.convertAndSendToUser(username, "/chat", notificationAndMessage);
                    continue;
                }

                // Send notification to user who is currently not subscribed to any chat endpoint
                ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chatId, userRepository.findByUsername(username).getId());
                if (chatMember.hasNotifications()) {
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
        List<ChatMessage> messages = messageRepository.findMessagesByChatId(chat.getId());
        ChatMember chatMember = chatMemberRepository.findChatMemberByChatIdAndMemberId(chat.getId(), userService.getCurrentUser().getId());

        // Check if messages list is not empty
        if (!messages.isEmpty()) {
            // Sort messages by timestamp in descending order to get the last message
            messages.sort(Comparator.comparing(ChatMessage::getTimestamp).reversed());

            // Check if the chat is a group and the current user is left the chat
            if (chat.isGroup() && chatMember.isLeft()) {
                // Get last message that sent by authedUser with type ANNOUNCEMENT
                for (ChatMessage message : messages) {
                    if (message.getSender().getId().equals(userService.getCurrentUser().getId()) && message.getType().equals(MessageType.ANNOUNCEMENT)) {
                        return convertToDTO(message);
                    }
                }
            }

            // Return the last message as a DTO
            return convertToDTO(messages.get(0));
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
                message.getStatus(),
                message.getType());
    }

    public void createEntryMessage(User sender, Chat chat) {
        ChatMessage entryMessage = ChatMessage.builder()
                .sender(sender)
                .chat(chat)
                .content(sender.getFirstName() + " " + sender.getLastName() + " has entered the chat")
                .timestamp(new Timestamp(System.currentTimeMillis()))
                .status(MessageStatus.SENT)
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
                .status(MessageStatus.SENT)
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
}
