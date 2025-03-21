package com.example.smsbackend.runner;

import com.example.smsbackend.entities.User;
import com.example.smsbackend.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class StartupRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StartupRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if principal already exists
        Optional<User> principalOpt = userRepository.findByEmail("principal@gmail.com");
        if (principalOpt.isEmpty()) {
            User principal = new User();
            principal.setFullName("Principal User");
            principal.setEmail("principal@gmail.com");
            principal.setPassword(passwordEncoder.encode("123456")); // Encode password
            principal.setRole("ROLE_PRINCIPAL");
            userRepository.save(principal);
            System.out.println("Principal user created.");
        }
    }
}
