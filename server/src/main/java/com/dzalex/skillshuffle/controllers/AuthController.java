package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.AuthRequestDTO;
import com.dzalex.skillshuffle.dtos.JwtResponseDTO;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO request, HttpServletResponse response) {
        // Authenticate user in the spring security context
        try {
            userService.doAuthenticate(request.getUsername(), request.getPassword());
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        // Generate access token and refresh token
        JwtResponseDTO jwtResponse = userService.authenticateUser(request, response);
        if (jwtResponse != null) {
            return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
        }
        return new ResponseEntity<>(Map.of("message", "User not found"), HttpStatus.NOT_FOUND);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestPart("user") String userStr,
                                      @RequestPart(value = "avatarBlob", required = false) MultipartFile avatarBlob) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        User registrationUser = mapper.readValue(userStr, User.class);

        if (userService.checkNicknameDuplicate(registrationUser.getNickname())) {
            return new ResponseEntity<>(Map.of("message", "Nickname already in use", "reason", "nickname"), HttpStatus.CONFLICT);
        }

        if (userService.checkUserDuplicate(registrationUser.getUsername(), registrationUser.getEmail())) {
            return new ResponseEntity<>(Map.of("message", "User already exists", "reason", "credentials"), HttpStatus.CONFLICT);
        }

        User user = userService.saveUser(registrationUser, avatarBlob);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        }

        return new ResponseEntity<>("Error occurred while registering user", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/confirm")
    public ResponseEntity<JwtResponseDTO> confirm(HttpServletRequest request) {
        // Confirm user authentication and return the access token
        JwtResponseDTO jwtResponse = userService.confirmAuthentication(request);
        if (jwtResponse != null) {
            return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        userService.logout(request, response);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
