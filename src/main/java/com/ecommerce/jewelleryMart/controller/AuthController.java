// AuthController.java
package com.ecommerce.jewelleryMart.controller;

import com.ecommerce.jewelleryMart.model.User;
import com.ecommerce.jewelleryMart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Handles user registration (signup).
     */
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("error", "Email already registered.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        response.put("message", "User registered successfully!");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Handles user login.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User loginRequest) {
        Map<String, String> response = new HashMap<>();
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), userOptional.get().getPassword())) {
            response.put("message", "Login successful!");
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Invalid email or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * Fetch user details for the Account page
     */
    @GetMapping("/user")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Update user (username only for now)
     */
    @PutMapping("/user")
    public ResponseEntity<?> updateUser(@RequestParam String email, @RequestBody User updatedData) {
        Map<String, String> response = new HashMap<>();
        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        if (existingUserOpt.isEmpty()) {
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        User existingUser = existingUserOpt.get();
        existingUser.setUsername(updatedData.getUsername());
        userRepository.save(existingUser);
        // Returning the updated user object as is, or a success message map
        return ResponseEntity.ok(existingUser); // Or return response.put("message", "User updated successfully");
    }

    /**
     * Reset user password by email
     * RequestBody is used to correctly parse the JSON sent from the frontend.
     */
    @PutMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody Map<String, String> requestBody // Changed to accept a Map for JSON body
    ) {
        Map<String, String> response = new HashMap<>();
        String email = requestBody.get("email");
        String newPassword = requestBody.get("newPassword");

        if (email == null || newPassword == null) {
            response.put("error", "Email and new password are required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            response.put("error", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        response.put("message", "Password updated successfully.");
        return ResponseEntity.ok(response);
    }
}
