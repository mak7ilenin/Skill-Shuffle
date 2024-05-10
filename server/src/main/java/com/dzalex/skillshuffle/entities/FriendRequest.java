package com.dzalex.skillshuffle.entities;

import com.dzalex.skillshuffle.enums.FriendRequestStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "friend_requests")
public class FriendRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ColumnDefault("pending")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private FriendRequestStatus status;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

}