package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.AuthRequestDTO;
import com.dzalex.skillshuffle.dtos.JwtResponseDTO;
import com.dzalex.skillshuffle.dtos.UserSessionDTO;
import com.dzalex.skillshuffle.models.RefreshToken;
import com.dzalex.skillshuffle.models.User;
import com.dzalex.skillshuffle.repositories.RefreshTokenRepository;
import com.dzalex.skillshuffle.repositories.UserRepository;
import com.dzalex.skillshuffle.services.JwtHelper;
import com.dzalex.skillshuffle.services.RefreshTokenService;
import com.dzalex.skillshuffle.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private JwtHelper helper;

    @PostMapping("login")
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
                    .user(new UserSessionDTO(
                            user.getFirst_name(),
                            user.getLast_name(),
                            user.getNickname(),
                            user.getAvatar_url()))
                    .build();
            return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
        } else {
            throw new UsernameNotFoundException("User not found!");
        }
    }

    @PostMapping("register")
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

    @GetMapping("confirm")
    // Confirm user authentication and return the access token
    public ResponseEntity<JwtResponseDTO> confirm(HttpServletRequest request) {
        String token = helper.getAccessTokenFromCookies(request);
        if (token != null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(helper.getUsernameFromToken(token));
            if (helper.validateToken(token, userDetails)) {
                return new ResponseEntity<>(JwtResponseDTO.builder()
                        .access_token(token)
                        .username(userDetails.getUsername())
                        .user(null)
                        .build(), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("refresh")
    // Refresh the access token using the refresh token
    public ResponseEntity<JwtResponseDTO> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = helper.getRefreshTokenFromCookies(request);
        if (refreshToken != null) {
            RefreshToken token = refreshTokenService.findByToken(refreshToken);
            if (token != null) {
                token = refreshTokenService.verifyExpiration(token, response);
                UserDetails userDetails = userDetailsService.loadUserByUsername(token.getUser().getUsername());
                JwtResponseDTO jwtResponse = JwtResponseDTO.builder()
                        .access_token(helper.createAccessTokenCookie(response, userDetails))
                        .username(token.getUser().getUsername())
                        .user(new UserSessionDTO(
                                token.getUser().getFirst_name(),
                                token.getUser().getLast_name(),
                                token.getUser().getNickname(),
                                token.getUser().getAvatar_url()))
                        .build();
                return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
            }
        }
        throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Refresh token is empty!");
    }

    @PostMapping("logout")
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
