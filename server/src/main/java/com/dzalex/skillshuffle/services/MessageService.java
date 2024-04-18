package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.MessageDTO;
import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.entities.Chat;
import com.dzalex.skillshuffle.enums.ChatAnnouncementType;
import com.dzalex.skillshuffle.enums.MessageStatus;
import com.dzalex.skillshuffle.entities.ChatMessage;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.enums.MessageType;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.repositories.MessageRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    public ChatMessage saveMessage(ChatMessage message, Integer chatId) {
        // Find the sender of the message
        User sender = userRepository.findByNickname(message.getSender().getNickname());

        if (sender == null) {
            throw new IllegalArgumentException("Sender not found!");
        }

        // Create a new message and set its attributes
        ChatMessage savedMessage = new ChatMessage();
        savedMessage.setSender(sender);
        savedMessage.setChat(chatRepository.findChatById(chatId));
        savedMessage.setContent(message.getContent());
        savedMessage.setTimestamp(message.getTimestamp());
        savedMessage.setStatus(MessageStatus.SENT);
        savedMessage.setType(MessageType.MESSAGE);

        // Save the message to the database
        return messageRepository.save(savedMessage);
    }

    public MessageDTO findLastMessageByChatId(Integer chatId) {
        List<ChatMessage> messages = messageRepository.findMessagesByChatId(chatId);

        // Check if messages list is not empty
        if (!messages.isEmpty()) {
            // Sort messages by timestamp in descending order to get the last message
            messages.sort(Comparator.comparing(ChatMessage::getTimestamp).reversed());

            // Return the last message as a DTO
            return convertToDTO(messages.get(0));
        } else {
            return null;
        }
    }

    public MessageDTO convertToDTO(ChatMessage message) {
        return new MessageDTO(
                message.getId(),
                new PublicUserDTO(
                        message.getSender().getFirstName(),
                        message.getSender().getLastName(),
                        message.getSender().getNickname(),
                        message.getSender().getAvatarUrl(),
                        message.getSender().getLastSeen()),
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
                .timestamp(Timestamp.from(new Date().toInstant()))
                .status(MessageStatus.SENT)
                .type(MessageType.ENTRY)
                .build();
        messageRepository.save(entryMessage);
    }

    public void createAnnouncementMessage(User sender, Chat chat, ChatAnnouncementType announcementType) {
        ChatMessage announcementMessage = ChatMessage.builder()
                .sender(sender)
                .chat(chat)
                .content(getAnnouncementMessageContent(sender, chat, announcementType))
                .timestamp(Timestamp.from(new Date().toInstant()))
                .status(MessageStatus.SENT)
                .type(MessageType.ANNOUNCEMENT)
                .build();
        messageRepository.save(announcementMessage);
    }

    private String getAnnouncementMessageContent(User sender, Chat chat, ChatAnnouncementType announcementType) {
        String senderName = "<b>" + sender.getFirstName() + " " + sender.getLastName() + "</b>";
        return switch (announcementType) {
            case JOINED -> senderName + " joined the chat";
            case LEFT -> senderName + " left the chat";
            case CREATED -> senderName + " created '" + chat.getName() + "'";
            case KICKED -> senderName + " was kicked from the chat";
            case INVITED -> senderName + " was invited to the chat";
        };
    }

    public void markMessageAsSeen(ChatMessage message) {
        ChatMessage messageToUpdate = messageRepository.findMessageById(message.getId());
        messageToUpdate.setStatus(MessageStatus.SEEN);
        messageRepository.save(messageToUpdate);
    }
}
