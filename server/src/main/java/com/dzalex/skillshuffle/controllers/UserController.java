package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.*;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.enums.RelationshipStatus;
import com.dzalex.skillshuffle.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // Get user info by nickname
    @GetMapping("/users/{nickname}")
    public UserProfileDTO getUserProfileData(@PathVariable String nickname) {
        User user = userService.getUserByNickname(nickname);
        return userService.getUserProfileData(user);
    }

    // Get user friends by nickname
    @GetMapping("/users/{nickname}/friends")
    public List<PublicUserDTO> getUserFriends(@PathVariable String nickname) {
        User user = userService.getUserByNickname(nickname);
        return userService.getUserFriends(user);
    }

    // Get user followers by nickname
    @GetMapping("/users/{nickname}/followers")
    public List<RelationshipUserDTO> getUserFollowers(@PathVariable String nickname) {
        User user = userService.getUserByNickname(nickname);
        return userService.getUserFollowers(user);
    }

    // Get authorized user friend requests
    @GetMapping("/users/friend-requests")
    public UserFollowerDTO getUserFollowersAndFollowing() {
        return userService.getFriendRequests();
    }

    // Search for users by nickname or name
    @GetMapping("/users/search")
    public List<RelationshipUserDTO> searchUsers(@RequestParam("q") String query) {
        return userService.searchUsers(query);
    }

    // Add user relationship
    @PostMapping("/users/relationships")
    public RelationshipStatus addUserRelationship(@RequestBody RelationshipActionDTO relationship) {
        return userService.changeUserRelationship(relationship);
    }
}
