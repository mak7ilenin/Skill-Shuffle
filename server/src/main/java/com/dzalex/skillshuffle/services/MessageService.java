package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.MessageDTO;
import com.dzalex.skillshuffle.models.Message;
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

    public void saveMessage(Message message, String chatId) {
        Message savedMessage = new Message();
        savedMessage.setSender(userRepository.findById(message.getSender().getId()).get());
        savedMessage.setChat(chatRepository.findChatById(Long.parseLong(chatId)));
        savedMessage.setContent(message.getContent());
        savedMessage.setTimestamp(message.getTimestamp());
        messageRepository.save(message);
    }

    public MessageDTO findLastMessageByChatId(Long chatId) {
        List<Message> messages = messageRepository.findMessagesByChatId(chatId);

        // Check if messages list is not empty
        if (!messages.isEmpty()) {
            // Sort messages by timestamp in descending order to get the last message
            messages.sort(Comparator.comparing(Message::getTimestamp).reversed());
            Message lastMessage = messages.get(0);
            return new MessageDTO(lastMessage.getId(), lastMessage.getContent(), lastMessage.getTimestamp());
        } else {
            return null;
        }
    }
}
