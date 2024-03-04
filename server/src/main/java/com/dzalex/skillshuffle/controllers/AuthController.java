package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.enums.Gender;
import com.dzalex.skillshuffle.models.JwtRequest;
import com.dzalex.skillshuffle.models.JwtResponse;
import com.dzalex.skillshuffle.models.User;
import com.dzalex.skillshuffle.repositories.UserRepository;
import com.dzalex.skillshuffle.services.JwtHelper;
import com.dzalex.skillshuffle.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private AuthenticationManagerBuilder authenticationManagerBuilder;

    @Autowired
    private JwtHelper helper;

    private final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("sign-in")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest request) {

        this.doAuthenticate(request.getUsername(), request.getPassword());
//        this.runConfigureCustom();

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = helper.generateToken(userDetails);

        JwtResponse response = JwtResponse.builder()
                .jwtToken(token)
                .username(userDetails.getUsername()).build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("sign-up")
    public ResponseEntity<?> register(@RequestBody User registrationUser) {
        try {
            if (userService.checkUserDuplicate(registrationUser.getUsername(), registrationUser.getEmail())) {
                return new ResponseEntity<>("User with username " + registrationUser.getUsername()
                        + " or email " + registrationUser.getEmail() + " already exists", HttpStatus.CONFLICT);
            }
            User user = new User(
                    registrationUser.getFirst_name(),
                    registrationUser.getLast_name(),
                    registrationUser.getUsername(),
                    passwordEncoder().encode(registrationUser.getPassword()),
                    registrationUser.getNickname(),
                    registrationUser.getEmail(),
                    registrationUser.getGender(),
                    registrationUser.getBirth_date(),
                    registrationUser.getBio(),
                    registrationUser.getAvatar_url()
            );
            userRepo.save(user);
            JwtResponse jwtResponse = login(new JwtRequest(user.getUsername(), registrationUser.getPassword())).getBody();
            if (jwtResponse == null) {
                return new ResponseEntity<>("Exception occurred while registering user", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(jwtResponse, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Exception occurred while registering user:" + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public void runConfigureCustom() {
        try {
            authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        } catch (Exception e) {
            logger.warn("Exception occurred while configuring AuthenticationManagerBuilder : {}", e.getMessage());
        }
    }

    private void doAuthenticate(String username, String password) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, password);
        try {
//            manager.authenticate(authentication);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException(" Invalid Username or Password  !!");
        }
    }

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandler() {
        return "Credentials Invalid !!";
    }

}
