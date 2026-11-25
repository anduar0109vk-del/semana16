package com.coffeecraft.controller;

import com.coffeecraft.dto.LoginRequest;
import com.coffeecraft.dto.LoginResponse;
import com.coffeecraft.dto.RegisterRequest;
import com.coffeecraft.model.User;
import com.coffeecraft.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername().trim());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(request.getPassword())) {
                // Sincronizar roles garantizados para cuentas del sistema
                if ("cliente".equalsIgnoreCase(user.getUsername())) {
                    user.setRole("ROLE_CLIENT");
                    userRepository.save(user);
                } else if ("admin".equalsIgnoreCase(user.getUsername())) {
                    user.setRole("ROLE_ADMIN");
                    userRepository.save(user);
                } else if ("demo".equalsIgnoreCase(user.getUsername())) {
                    user.setRole("ROLE_BARISTA");
                    userRepository.save(user);
                }

                String token = "coffeecraft-token-" + UUID.randomUUID();
                LoginResponse response = new LoginResponse(
                        true,
                        "Bienvenido a CoffeeCraft, " + user.getFullName(),
                        token,
                        user.getId(),
                        user.getUsername(),
                        user.getFullName(),
                        user.getRole()
                );
                return ResponseEntity.ok(response);
            }
        }

        LoginResponse failResponse = new LoginResponse(
                false,
                "Usuario o contraseña incorrectos",
                null,
                null,
                null,
                null,
                null
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(failResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername().trim())) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya está registrado");
        }

        User newUser = new User(
                request.getUsername().trim(),
                request.getPassword(),
                request.getFullName().trim(),
                "ROLE_CLIENT"
        );
        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }
}
