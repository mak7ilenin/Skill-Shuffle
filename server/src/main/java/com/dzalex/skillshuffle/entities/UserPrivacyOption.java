package com.dzalex.skillshuffle.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "user_privacy_options")
public class UserPrivacyOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ColumnDefault("all users")
    @Lob
    @Column(name = "view_main_information", nullable = false)
    private String viewMainInformation;

    @ColumnDefault("all users")
    @Lob
    @Column(name = "view_followings", nullable = false)
    private String viewFollowings;

    @ColumnDefault("all users")
    @Lob
    @Column(name = "view_photos_videos", nullable = false)
    private String viewPhotosVideos;

    @ColumnDefault("all users")
    @Lob
    @Column(name = "view_friends", nullable = false)
    private String viewFriends;

    @ColumnDefault("full birthday")
    @Lob
    @Column(name = "birthday_settings", nullable = false)
    private String birthdaySettings;

    @ColumnDefault("all users")
    @Lob
    @Column(name = "view_post_comments", nullable = false)
    private String viewPostComments;

    @ColumnDefault("all users")
    @Lob
    @Column(name = "comment_on_posts", nullable = false)
    private String commentOnPosts;

    @ColumnDefault("all users")
    @Lob
    @Column(name = "send_private_messages", nullable = false)
    private String sendPrivateMessages;

    @ColumnDefault("all users")
    @Lob
    @Column(name = "add_to_chats", nullable = false)
    private String addToChats;

    @ColumnDefault("all users")
    @Lob
    @Column(name = "invite_to_communities", nullable = false)
    private String inviteToCommunities;

}