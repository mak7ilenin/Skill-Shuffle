package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.MessageDTO;
import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.enums.MessageStatus;
import com.dzalex.skillshuffle.entities.ChatMessage;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.repositories.MessageRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        // Save the message to the database
        return messageRepository.save(savedMessage);
    }

    public MessageDTO findLastMessageByChatId(Integer chatId) {
        List<ChatMessage> messages = messageRepository.findMessagesByChatId(chatId);

        // Check if messages list is not empty
        if (!messages.isEmpty()) {
            // Sort messages by timestamp in descending order to get the last message
            messages.sort(Comparator.comparing(ChatMessage::getTimestamp).reversed());
            ChatMessage lastMessage = messages.get(0);
            return new MessageDTO(
                    lastMessage.getId(),
                    new PublicUserDTO(
                            lastMessage.getSender().getFirstName(),
                            lastMessage.getSender().getLastName(),
                            lastMessage.getSender().getNickname(),
                            lastMessage.getSender().getAvatarUrl(),
                            lastMessage.getSender().getLastSeen()),
                    lastMessage.getContent(),
                    lastMessage.getTimestamp(),
                    lastMessage.getStatus());
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
                message.getStatus());
    }

    public void markMessageAsSeen(ChatMessage message) {
        ChatMessage messageToUpdate = messageRepository.findMessageById(message.getId());
        messageToUpdate.setStatus(MessageStatus.SEEN);
        messageRepository.save(messageToUpdate);
    }
}
