package com.example.pizzadash.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final String SECRET_KEY = "very_secret_key_change_me";
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        System.out.println("[JWT Filter] Request path: " + request.getServletPath());
        System.out.println("[JWT Filter] Authorization header: " + header);
        String token = null;
        String username = null;

        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            token = header.substring(7);
            System.out.println("[JWT Filter] Token: " + token.substring(0, Math.min(20, token.length())) + "...");
            try {
                username = com.example.pizzadash.config.JwtUtil.extractUsername(token);
                System.out.println("[JWT Filter] Extracted username: " + username);
            } catch (Exception e) {
                System.out.println("[JWT Filter] Invalid token: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("[JWT Filter] No valid Authorization header found");
        }

        if (username != null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("[JWT Filter] Authentication set for user: " + username);
                } else {
                    System.out.println("[JWT Filter] UserDetails not found for username: " + username);
                }
            } catch (Exception e) {
                System.out.println("[JWT Filter] Error loading user details: " + e.getMessage());
                e.printStackTrace();
            }
        } else if (username == null) {
            System.out.println("[JWT Filter] No username extracted from token");
        }

        System.out.println("[JWT Filter] Current authentication: " + SecurityContextHolder.getContext().getAuthentication());
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return path.equals("/api/auth/login");
    }
} 