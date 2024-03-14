package com.dzalex.skillshuffle.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Table(name = "refresh_token")
@Entity
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String token;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    private Instant expires_at;
}
