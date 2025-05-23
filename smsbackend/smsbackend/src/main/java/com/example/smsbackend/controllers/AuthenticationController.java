package com.example.smsbackend.controllers;

import com.example.smsbackend.dtos.LoginUserDto;
import com.example.smsbackend.dtos.RegisterUserDto;
import com.example.smsbackend.entities.User;
import com.example.smsbackend.responses.LoginResponse;
import com.example.smsbackend.services.AuthenticationService;
import com.example.smsbackend.services.JwtService;
import com.example.smsbackend.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;
    private final UserService userService; // Declare UserService

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, UserService userService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        // Generate JWT Token with role
        String jwtToken = jwtService.generateToken(authenticatedUser, authenticatedUser.getRole(), authenticatedUser.getFullName(), authenticatedUser.getId());
        long expirationTime = jwtService.getExpirationTime();

        // Prepare response with token and role
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(expirationTime);
        loginResponse.setRole(authenticatedUser.getRole());
        loginResponse.setFullName(authenticatedUser.getFullName());
        loginResponse.setId(authenticatedUser.getId());

        return ResponseEntity.ok(loginResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id, @RequestHeader("Authorization") String token) {
        // Validate JWT token
        boolean isValid = jwtService.validateToken(token.substring(7)); // Remove "Bearer " prefix
        if (!isValid) {
            return ResponseEntity.status(401).body("Invalid or expired token.");
        }

        // Call the service method to delete the user
        userService.deleteUser(id); // Use the injected userService to delete the user

        return ResponseEntity.ok("User with ID " + id + " has been deleted successfully.");
    }
}
