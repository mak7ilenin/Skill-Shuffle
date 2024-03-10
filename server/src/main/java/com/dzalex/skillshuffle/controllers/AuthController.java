package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.models.JwtRequest;
import com.dzalex.skillshuffle.models.JwtResponse;
import com.dzalex.skillshuffle.models.User;
import com.dzalex.skillshuffle.services.JwtHelper;
import com.dzalex.skillshuffle.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private JwtHelper helper;

    @PostMapping("sign-in")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest request, HttpServletResponse response) {

        // Authenticate user in the spring security context
        doAuthenticate(request.getUsername(), request.getPassword());

        // Create cookie with jwt token and set it in the response
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        if (userDetails != null) {
            JwtResponse jwtResponse = helper.createJwtCookie(request, response, userDetails);
            return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("sign-up")
    public ResponseEntity<?> register(@RequestBody User registrationUser, HttpServletResponse response) {
        try {
            if (userService.checkUserDuplicate(registrationUser.getUsername(), registrationUser.getEmail())) {
                return new ResponseEntity<>("User with username " + registrationUser.getUsername()
                        + " or email " + registrationUser.getEmail() + " already exists", HttpStatus.CONFLICT);
            }
            User user = userService.saveUser(registrationUser);
            JwtResponse jwtResponse = login(
                    new JwtRequest(
                            user.getUsername(),
                            registrationUser.getPassword()
                    ), response).getBody();
            return new ResponseEntity<>(jwtResponse, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Exception occurred while registering user:" + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Request to confirm user's authentication and get jwt token
    @GetMapping("confirm")
    public ResponseEntity<?> confirm(HttpServletRequest request) {
        if (SecurityContextHolder.getContext().getAuthentication() != null &&
                SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            String jwtToken = helper.getTokenFromCookies(request);
            if (jwtToken != null) {
                return new ResponseEntity<>(new JwtResponse(jwtToken, username), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    private void doAuthenticate(String username, String password) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, password);
        try {
            manager.authenticate(authentication);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException(" Invalid Username or Password!");
        }
    }

    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandler() {
        return "Credentials Invalid!";
    }

}
