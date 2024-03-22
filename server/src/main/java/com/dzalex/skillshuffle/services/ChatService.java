package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.ChatDTO;
import com.dzalex.skillshuffle.dtos.ChatPreviewDTO;
import com.dzalex.skillshuffle.dtos.MessageDTO;
import com.dzalex.skillshuffle.models.Chat;
import com.dzalex.skillshuffle.models.Message;
import com.dzalex.skillshuffle.models.User;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import com.dzalex.skillshuffle.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public List<ChatPreviewDTO> getChatListWithLastMessage() {
        List<Chat> chats = chatRepository.findAll();
        List<ChatPreviewDTO> chatPreviewDTOs = new ArrayList<>();

        for (Chat chat : chats) {
            MessageDTO lastMessage = messageService.findLastMessageByChatId(chat.getId());
            ChatPreviewDTO chatPreviewDTO = new ChatPreviewDTO();

            // Populate the DTO with chat information and last message
            chatPreviewDTO.setId(chat.getId());
            chatPreviewDTO.setName(chat.getName());
            chatPreviewDTO.setChatType(chat.getChatType());
            chatPreviewDTO.setAvatar_url(chat.getAvatar_url());
            chatPreviewDTO.setLast_message(lastMessage);

            chatPreviewDTOs.add(chatPreviewDTO);
        }

        return chatPreviewDTOs;
    }

    public ChatDTO getChatWithMessages(Chat chat) {
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setId(chat.getId());
        chatDTO.setName(chat.getName());
        chatDTO.setChatType(chat.getChatType());
        chatDTO.setAvatar_url(chat.getAvatar_url());

        List<Message> messages = messageRepository.findMessagesByChatId(chat.getId());
        for (Message message : messages) {
            MessageDTO messageDTO = messageService.convertToDTO(message);
            if (chatDTO.getMessages() == null) {
                chatDTO.setMessages(new ArrayList<>());
            }
            chatDTO.getMessages().add(messageDTO);
        }
        // Sort messages by timestamp in ascending order
        chatDTO.getMessages().sort(Comparator.comparing(MessageDTO::getTimestamp));

        return chatDTO;
    }
}
