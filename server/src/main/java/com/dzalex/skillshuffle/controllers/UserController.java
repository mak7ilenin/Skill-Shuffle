package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.dtos.RelationshipActionDTO;
import com.dzalex.skillshuffle.dtos.SearchedUserDTO;
import com.dzalex.skillshuffle.dtos.UserProfileDTO;
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

    // Search for users by nickname or name
    @GetMapping("/users/search")
    public List<SearchedUserDTO> searchUsers(@RequestParam("q") String query) {
        return userService.searchUsers(query);
    }

    // Add user relationship
    @PostMapping("/users/relationships") // Body has { "nickname": "friendNickname", "action": "add_friend"}
    public RelationshipStatus addUserRelationship(@RequestBody RelationshipActionDTO relationship) {
        return userService.changeUserRelationship(relationship);
    }
}
