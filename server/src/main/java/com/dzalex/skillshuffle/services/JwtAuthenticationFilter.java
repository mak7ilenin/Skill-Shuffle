package com.dzalex.skillshuffle.services;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    public void doFilterInternal(@NonNull HttpServletRequest request,
                                 @NonNull HttpServletResponse response,
                                 @NonNull FilterChain chain) throws IOException, ServletException
    {
        String username = null;
        String token;

        // Get token from the header
        token = jwtHelper.getTokenFromHeader(request);
        if (token != null) {
            username = tryToGetUsernameFromToken(token);
        }

        // Get token from cookies
        if (token == null) {
            token = jwtHelper.getAccessTokenFromCookies(request);
            if (token != null) {
                username = tryToGetUsernameFromToken(token);
            }
        }

        // Validate token and set the authentication
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Fetch user detail from username
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            Boolean validateToken = jwtHelper.validateToken(token, userDetails);
            if (validateToken) {
                // Set the authentication
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                throw new IllegalArgumentException("Validation fails!");
            }
        }
        chain.doFilter(request, response);
    }

    private String tryToGetUsernameFromToken(String token) {
        try {
            return jwtHelper.getUsernameFromToken(token);
        } catch (IllegalArgumentException e) {
            logger.info("Illegal Argument while fetching the username!");
        } catch (ExpiredJwtException e) {
            logger.info("Given jwt token is expired!");
        } catch (MalformedJwtException e) {
            logger.info("Some changed has done in token! Invalid Token");
        }
        return null;
    }
}