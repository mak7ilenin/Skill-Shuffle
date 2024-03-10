package com.dzalex.skillshuffle.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.util.Collections;


@Component
public class WebSocketAuthenticatorService {

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private UserDetailsService userDetailsService;

    public UsernamePasswordAuthenticationToken getAuthenticatedOrFail(String token) throws AuthenticationException {
        // Get username from token
        String username = jwtHelper.getUsernameFromToken(token);
        if (username != null) {
            // Fetch user detail from username to validate token
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            Boolean validateToken = jwtHelper.validateToken(token, userDetails);
            if (!validateToken) {
                throw new AuthenticationCredentialsNotFoundException("Token is not valid!");
            }
        }
        return new UsernamePasswordAuthenticationToken(
                username,
                null,
                Collections.singleton((GrantedAuthority) () -> "USER"));
    }
}
