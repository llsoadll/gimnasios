package com.gimnasio.gestion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.gimnasio.gestion.dto.ClienteDetalleDTO;
import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
public ResponseEntity<List<Usuario>> obtenerUsuarios() {
    return ResponseEntity.ok(usuarioService.obtenerTodos());
}

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        // Verificar si ya existe un usuario con ese email
        if (usuarioService.existeEmail(usuario.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        Usuario nuevoUsuario = usuarioService.guardarUsuario(usuario);
        return ResponseEntity.ok(nuevoUsuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/detalle")
public ResponseEntity<ClienteDetalleDTO> obtenerDetalleCliente(@PathVariable Long id) {
    try {
        ClienteDetalleDTO detalle = usuarioService.obtenerDetalleCliente(id);
        return ResponseEntity.ok(detalle);
    } catch (ResourceNotFoundException e) {
        return ResponseEntity.notFound().build();
    }
}
}