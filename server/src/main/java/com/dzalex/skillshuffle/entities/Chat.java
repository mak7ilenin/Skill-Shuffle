package com.dzalex.skillshuffle.entities;

import com.dzalex.skillshuffle.enums.ChatType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id")
    private Community community;

//    @ToString.Exclude
//    @OneToMany(mappedBy = "chat", fetch = FetchType.LAZY)
//    private List<ChatMember> members;

    @JsonIgnore
    public boolean isPrivate() {
        return type == ChatType.PRIVATE;
    }

    @JsonIgnore
    public boolean isGroup() {
        return type == ChatType.GROUP;
    }

    @JsonIgnore
    public boolean isCommunity() {
        return type == ChatType.COMMUNITY;
    }
}