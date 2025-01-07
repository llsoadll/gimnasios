package com.gimnasio.gestion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

import com.gimnasio.gestion.dto.ClienteDetalleDTO;
import com.gimnasio.gestion.dto.UsuarioDTO;
import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.service.UsuarioService;
import com.gimnasio.gestion.mapper.UsuarioMapper;
import com.gimnasio.gestion.model.Membresia;
import com.gimnasio.gestion.mapper.MembresiaMapper;
import com.gimnasio.gestion.repository.UsuarioRepository;
import java.util.Comparator;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MembresiaMapper membresiaMapper;

    @GetMapping
public ResponseEntity<List<Usuario>> obtenerUsuarios() {
    return ResponseEntity.ok(usuarioService.obtenerTodos());
}

@GetMapping("/{id}/membresia-activa")
public ResponseEntity<?> getMembresiaActiva(@PathVariable Long id) {
    try {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
                
        // Obtener la última membresía, esté activa o no
        Membresia ultimaMembresia = usuario.getMembresias().stream()
            .max(Comparator.comparing(Membresia::getFechaFin))
            .orElse(null);
                
        if (ultimaMembresia == null) {
            return ResponseEntity.ok(null);
        }
            
        return ResponseEntity.ok(membresiaMapper.toDTO(ultimaMembresia));
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error al obtener membresía");
    }
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

    @PatchMapping("/{id}/estado")
@CrossOrigin(origins = "http://localhost:3000")
public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam boolean activo) {
    try {
        Usuario usuario = usuarioService.cambiarEstado(id, activo);
        return ResponseEntity.ok(usuario);
    } catch (Exception e) {
        e.printStackTrace(); // Para ver el error en los logs
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al cambiar estado: " + e.getMessage());
    }
}

@GetMapping("/clientes")
    public ResponseEntity<List<UsuarioDTO>> obtenerClientes() {
        List<Usuario> clientes = usuarioService.obtenerClientesActivos();
        List<UsuarioDTO> clientesDTO = clientes.stream()
            .map(usuarioMapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(clientesDTO);
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

@PutMapping("/{id}")
public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
    try {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
            
        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setApellido(usuarioActualizado.getApellido());
        usuario.setEmail(usuarioActualizado.getEmail());
        usuario.setTelefono(usuarioActualizado.getTelefono());
        usuario.setFechaNacimiento(usuarioActualizado.getFechaNacimiento());
        
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return ResponseEntity.ok(usuarioGuardado);
    } catch (Exception e) {
        throw new RuntimeException("Error al actualizar usuario: " + e.getMessage());
    }
}
}