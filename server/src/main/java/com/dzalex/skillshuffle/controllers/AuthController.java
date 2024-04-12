package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.AuthRequestDTO;
import com.dzalex.skillshuffle.dtos.JwtResponseDTO;
import com.dzalex.skillshuffle.dtos.PublicUserDTO;
import com.dzalex.skillshuffle.entities.RefreshToken;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.repositories.UserRepository;
import com.dzalex.skillshuffle.services.JwtHelper;
import com.dzalex.skillshuffle.services.RefreshTokenService;
import com.dzalex.skillshuffle.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private JwtHelper helper;

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> login(@RequestBody AuthRequestDTO request, HttpServletResponse response) {

        // Authenticate user in the spring security context
        doAuthenticate(request.getUsername(), request.getPassword());

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        if (userDetails != null) {
            // Create refresh token and save it in the database and in the cookie
            RefreshToken refreshToken = refreshTokenService.generateRefreshToken(request.getUsername());
            helper.createRefreshTokenCookie(response, refreshToken);

            // Create access token and save it in the cookie
            helper.createAccessTokenCookie(response, userDetails);

            User user = userRepository.findByUsername(request.getUsername());
            JwtResponseDTO jwtResponse = JwtResponseDTO.builder()
                    .username(request.getUsername())
                    .access_token(helper.createAccessTokenCookie(response, userDetails))
                    .user(new PublicUserDTO(
                            user.getFirstName(),
                            user.getLastName(),
                            user.getNickname(),
                            user.getAvatarUrl()))
                    .build();
            return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
        } else {
            throw new UsernameNotFoundException("User not found!");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User registrationUser) {
        try {
            if (userService.checkUserDuplicate(registrationUser.getUsername(), registrationUser.getEmail())) {
                return new ResponseEntity<>("User with username " + registrationUser.getUsername()
                        + " or email " + registrationUser.getEmail() + " already exists", HttpStatus.CONFLICT);
            }
            User user = userService.saveUser(registrationUser);
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Exception occurred while registering user:" + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/confirm")
    // Confirm user authentication and return the access token
    public ResponseEntity<JwtResponseDTO> confirm(HttpServletRequest request) {
        String token = helper.getAccessTokenFromCookies(request);
        if (token != null) {
            String username = helper.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (helper.validateToken(token, userDetails)) {
                User user = userRepository.findByUsername(username);
                return new ResponseEntity<>(JwtResponseDTO.builder()
                        .username(userDetails.getUsername())
                        .access_token(token)
                        .user(new PublicUserDTO(
                                user.getFirstName(),
                                user.getLastName(),
                                user.getNickname(),
                                user.getAvatarUrl()))
                        .build(), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
//        return null;
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // Invalidate session
        request.getSession().invalidate();
        // Clear authentication
        SecurityContextHolder.clearContext();
        // Clear access token from the cookies
        helper.deleteAccessTokenCookie(response);
        // Clear refresh token from the cookies and database
        String refreshToken = helper.getRefreshTokenFromCookies(request);
        if (refreshToken != null) {
            refreshTokenService.deleteByToken(refreshToken);
            helper.deleteRefreshTokenCookie(response);
            return new ResponseEntity<>("Logout successful!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Logout failed!", HttpStatus.BAD_REQUEST);
    }

    private void doAuthenticate(String username, String password) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, password);
        try {
            manager.authenticate(authentication);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid Username or Password!");
        }
    }

    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandler() {
        return "Credentials Invalid!";
    }

}
