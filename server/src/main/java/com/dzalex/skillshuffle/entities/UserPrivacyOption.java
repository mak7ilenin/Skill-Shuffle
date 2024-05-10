package com.dzalex.skillshuffle.entities;

import com.dzalex.skillshuffle.enums.BirthdayVisibility;
import com.dzalex.skillshuffle.enums.PrivacyOption;
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
    @Enumerated(EnumType.STRING)
    @Column(name = "view_main_information", nullable = false)
    private PrivacyOption viewMainInformation;

    @ColumnDefault("all users")
    @Enumerated(EnumType.STRING)
    @Column(name = "view_followings", nullable = false)
    private PrivacyOption viewFollowings;

    @ColumnDefault("all users")
    @Enumerated(EnumType.STRING)
    @Column(name = "view_photos_videos", nullable = false)
    private PrivacyOption viewPhotosVideos;

    @ColumnDefault("all users")
    @Enumerated(EnumType.STRING)
    @Column(name = "view_friends", nullable = false)
    private PrivacyOption viewFriends;

    @ColumnDefault("full birthday")
    @Enumerated(EnumType.STRING)
    @Column(name = "birthday_settings", nullable = false)
    private BirthdayVisibility birthdaySettings;

    @ColumnDefault("all users")
    @Enumerated(EnumType.STRING)
    @Column(name = "view_post_comments", nullable = false)
    private PrivacyOption viewPostComments;

    @ColumnDefault("all users")
    @Enumerated(EnumType.STRING)
    @Column(name = "comment_on_posts", nullable = false)
    private PrivacyOption commentOnPosts;

    @ColumnDefault("all users")
    @Enumerated(EnumType.STRING)
    @Column(name = "send_private_messages", nullable = false)
    private PrivacyOption sendPrivateMessages;

    @ColumnDefault("all users")
    @Enumerated(EnumType.STRING)
    @Column(name = "add_to_chats", nullable = false)
    private PrivacyOption addToChats;

    @ColumnDefault("all users")
    @Enumerated(EnumType.STRING)
    @Column(name = "invite_to_communities", nullable = false)
    private PrivacyOption inviteToCommunities;
}