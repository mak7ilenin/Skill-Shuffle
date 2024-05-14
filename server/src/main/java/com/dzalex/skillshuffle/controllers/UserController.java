package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.dtos.SearchedUserDTO;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

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
}
