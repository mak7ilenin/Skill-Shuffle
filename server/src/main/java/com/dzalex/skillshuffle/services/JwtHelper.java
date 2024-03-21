package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.models.RefreshToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtHelper {

    public static final long ACCESS_TOKEN_VALIDITY = 2 * 60 * 60; // 2 hours
    public static final long REFRESH_TOKEN_VALIDITY = 7 * 24 * 60 * 60; // 7 days
    @Value("${jwt.secret}")
    private String SECRET_KEY;
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String AUTHORIZATION_HEADER_PREFIX = "Bearer ";
    private static final String ACCESS_TOKEN_COOKIE_NAME = "skill_shuffle.access_token";
    private static final String REFRESH_TOKEN_COOKIE_NAME = "skill_shuffle.refresh_token";

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY));
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    // For retrieving any information from token we will need the secret key
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, userDetails.getUsername());
    }

    /* While creating the token:
     * 1. Define claims of the token, like Issuer, Expiration, Subject, and the ID
     * 2. Sign the JWT using the HS512 algorithm and secret key.
    */
    private String doGenerateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY * 1000))
                .signWith(key())
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String getTokenFromCookies(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(cookieName)) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public String getTokenFromHeader(HttpServletRequest request) {
        String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);
        if (authorizationHeader != null && authorizationHeader.startsWith(AUTHORIZATION_HEADER_PREFIX)) {
            return authorizationHeader.substring(7);
        }
        return null;
    }

    public String createCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setPath("/"); // Set cookie for the whole application
        cookie.setMaxAge(maxAge);
        // CHANGES FOR LOCAL NETWORK TESTING
//        cookie.setAttribute("SameSite", "None");
//        cookie.setSecure(true);
        // END CHANGES
        response.addCookie(cookie);
        return value;
    }

    public void cleanCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        // CHANGES FOR LOCAL NETWORK TESTING
//        cookie.setAttribute("SameSite", "None");
//        cookie.setSecure(true);
        // END CHANGES
        response.addCookie(cookie);
    }

    // Access token cookie management
    public String getAccessTokenFromCookies(HttpServletRequest request) {
        return getTokenFromCookies(request, ACCESS_TOKEN_COOKIE_NAME);
    }

    public String createAccessTokenCookie(HttpServletResponse response, UserDetails userDetails) {
        String token = generateToken(userDetails);
        return createCookie(response, ACCESS_TOKEN_COOKIE_NAME, token, (int) ACCESS_TOKEN_VALIDITY);
    }

    public void deleteAccessTokenCookie(HttpServletResponse response) {
        cleanCookie(response, ACCESS_TOKEN_COOKIE_NAME);
    }

    // Refresh token cookie management
    public void createRefreshTokenCookie(HttpServletResponse response, RefreshToken refreshToken) {
        createCookie(response, REFRESH_TOKEN_COOKIE_NAME, refreshToken.getToken(), (int) REFRESH_TOKEN_VALIDITY);
    }

    public String getRefreshTokenFromCookies(HttpServletRequest request) {
        return getTokenFromCookies(request, REFRESH_TOKEN_COOKIE_NAME);
    }

    public void deleteRefreshTokenCookie(HttpServletResponse response) {
        cleanCookie(response, REFRESH_TOKEN_COOKIE_NAME);
    }
}
