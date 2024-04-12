package com.dzalex.skillshuffle.entities;

import com.dzalex.skillshuffle.enums.ChatType;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chats")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", length = 75)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ChatType type;

    @Column(name = "avatar_url")
    private String avatarUrl;

}