package com.example.pizzadash.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import org.springframework.security.core.context.SecurityContextHolder;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/login")
    
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("Received login: username=" + request.getUsername() + ", password=" + request.getPassword());
        // Debug: Try to fetch user from UserDetailsService
        try {
            org.springframework.security.core.userdetails.UserDetails user = userDetailsService.loadUserByUsername(request.getUsername());
            System.out.println("UserDetailsService found user: " + user.getUsername());
            System.out.println("User password: " + user.getPassword());
        } catch (Exception ex) {
            System.out.println("UserDetailsService could not find user: " + ex.getMessage());
        }
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            org.springframework.security.core.userdetails.UserDetails userDetails = (org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal();
            // Generate JWT using JwtUtil
            String token = com.example.pizzadash.config.JwtUtil.generateToken(userDetails.getUsername());
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } catch (Exception e) {
            System.out.println("Authentication failed: " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/testpost")
    public String testPost() {
        return "POST is accessible";
    }

    @GetMapping("/login")
    public String loginTest() {
        return "login endpoint is accessible";
    }

    @PostMapping("/testopen")
    public ResponseEntity<String> testOpen() {
        return ResponseEntity.ok("Open endpoint works!");
    }

    @GetMapping("/testauth")
    public ResponseEntity<String> testAuth() {
        return ResponseEntity.ok("Authenticated endpoint works! User: " + 
            SecurityContextHolder.getContext().getAuthentication().getName());
    }

    public static class LoginRequest {
        private String username;
        private String password;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
} 