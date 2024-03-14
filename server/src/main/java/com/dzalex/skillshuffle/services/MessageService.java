package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.MessageDTO;
import com.dzalex.skillshuffle.dtos.MessageSender;
import com.dzalex.skillshuffle.enums.MessageStatus;
import com.dzalex.skillshuffle.models.Message;
import com.dzalex.skillshuffle.models.User;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.repositories.MessageRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    public Message saveMessage(Message message, String chatId) {
        // Find the sender of the message
        User sender = userRepository.findByNickname(message.getSender().getNickname());

        if (sender == null) {
            System.out.println("Sender not found for nickname: " + message.getSender().getNickname());
            throw new IllegalArgumentException("Sender not found");
        }

        // Create a new message and set its attributes
        Message savedMessage = new Message();
        savedMessage.setSender(sender);
        savedMessage.setChat(chatRepository.findChatById(Long.parseLong(chatId)));
        savedMessage.setContent(message.getContent());
        savedMessage.setTimestamp(message.getTimestamp());
        savedMessage.setStatus(MessageStatus.SENT);

        // Save the message to the database
        return messageRepository.save(savedMessage);
    }

    public MessageDTO findLastMessageByChatId(Long chatId) {
        List<Message> messages = messageRepository.findMessagesByChatId(chatId);

        // Check if messages list is not empty
        if (!messages.isEmpty()) {
            // Sort messages by timestamp in descending order to get the last message
            messages.sort(Comparator.comparing(Message::getTimestamp).reversed());
            Message lastMessage = messages.get(0);
            return new MessageDTO(
                    lastMessage.getId(),
                    new MessageSender(
                            lastMessage.getSender().getId(),
                            lastMessage.getSender().getFirst_name(),
                            lastMessage.getSender().getLast_name(),
                            lastMessage.getSender().getNickname(),
                            lastMessage.getSender().getAvatar_url()),
                    lastMessage.getContent(),
                    lastMessage.getTimestamp(),
                    lastMessage.getStatus());
        } else {
            return null;
        }
    }

    public MessageDTO convertToDTO(Message message) {
        return new MessageDTO(
                message.getId(),
                new MessageSender(
                        message.getSender().getId(),
                        message.getSender().getFirst_name(),
                        message.getSender().getLast_name(),
                        message.getSender().getNickname(),
                        message.getSender().getAvatar_url()),
                message.getContent(),
                message.getTimestamp(),
                message.getStatus());
    }
}
