package com.gimnasio.gestion.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gimnasio.gestion.dto.LoginRequest;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @PostMapping("/login")  
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    try {
        System.out.println("Intento de login con email: " + loginRequest.getEmail());
        
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        System.out.println("Password ingresado: " + loginRequest.getPassword());
        System.out.println("Password almacenado: " + usuario.getPassword());
        
        if (!usuario.getPassword().equals(loginRequest.getPassword())) {
            System.out.println("Las contraseñas no coinciden");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Credenciales inválidas");
        }
            
            if (!usuario.isActivo()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuario inactivo");
            }
            
            // Create response with token and user info
            Map<String, Object> response = new HashMap<>();
            response.put("id", usuario.getId());
            response.put("email", usuario.getEmail());
            response.put("role", usuario.getTipo().toString());
            response.put("token", "dummy-token"); // En una implementación real, usar JWT
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Error de autenticación: " + e.getMessage());
        }
    }

    
}