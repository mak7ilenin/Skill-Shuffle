package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.models.RefreshToken;
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

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Override
    public void doFilterInternal(@NonNull HttpServletRequest request,
                                 @NonNull HttpServletResponse response,
                                 @NonNull FilterChain chain) throws IOException, ServletException
    {
        String username = null;

//        Get access token from the header
//        token = jwtHelper.getTokenFromHeader(request);
//        if (token != null) {
//            username = tryToGetUsernameFromToken(token, response);
//        }

        // Get access token from cookies
        String accessToken = jwtHelper.getAccessTokenFromCookies(request);
        if (accessToken != null) {
            username = tryToGetUsernameFromToken(accessToken, response);
        } else {
            // REFRESH TOKEN FUNCTIONALITY
            String refreshTokenString = jwtHelper.getRefreshTokenFromCookies(request);
            if (refreshTokenString != null) {
                RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenString);
                if (refreshTokenService.verifyExpiration(refreshToken, response) != null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(refreshToken.getUser().getUsername());
                    accessToken = jwtHelper.createAccessTokenCookie(response, userDetails);
                    username = jwtHelper.getUsernameFromToken(accessToken);
                }
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
        }

        // Validate access token and set the authentication
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Fetch user details by username
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            Boolean validateToken = jwtHelper.validateToken(accessToken, userDetails);
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

    private String tryToGetUsernameFromToken(String token, HttpServletResponse response) {
        try {
            return jwtHelper.getUsernameFromToken(token);
        } catch (ExpiredJwtException e) {
            logger.error("Given JWT token is expired!");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Expired token status code
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token!");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // Invalid token status code
        } catch (Exception e) {
            logger.error("Error occurred while parsing JWT token!");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // Other error status code
        }
        return null;
    }
}