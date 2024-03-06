package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.ChatDTO;
import com.dzalex.skillshuffle.dtos.MessageDTO;
import com.dzalex.skillshuffle.models.Chat;
import com.dzalex.skillshuffle.models.Message;
import com.dzalex.skillshuffle.repositories.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {
    @Autowired
    private MessageService messageService;

    @Autowired
    private ChatRepository chatRepository;

    public List<ChatDTO> getChatListWithLastMessage() {
        List<Chat> chats = chatRepository.findAll();
        List<ChatDTO> chatDTOs = new ArrayList<>();

        for (Chat chat : chats) {
            MessageDTO lastMessage = messageService.findLastMessageByChatId(chat.getId());
            ChatDTO chatDTO = new ChatDTO();

            // Populate the DTO with chat information and last message
            chatDTO.setId(chat.getId());
            chatDTO.setName(chat.getName());
            chatDTO.setChatType(chat.getChatType());
            chatDTO.setAvatar_url(chat.getAvatar_url());
            chatDTO.setLastMessage(lastMessage);

            chatDTOs.add(chatDTO);
        }

        return chatDTOs;
    }
}
