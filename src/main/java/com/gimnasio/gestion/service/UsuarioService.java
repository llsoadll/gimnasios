package com.gimnasio.gestion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import com.gimnasio.gestion.dto.ClienteDetalleDTO;
import com.gimnasio.gestion.dto.UsuarioDTO;
import com.gimnasio.gestion.enums.TipoUsuario;
import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.mapper.ClienteDetalleMapper;
import com.gimnasio.gestion.mapper.UsuarioMapper;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.CajaIngresoRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;

@Service
@Transactional
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Autowired
    private CajaIngresoRepository cajaIngresoRepository;

    @Autowired
    private ClienteDetalleMapper clienteDetalleMapper;  

public ClienteDetalleDTO obtenerDetalleCliente(Long id) {
    Usuario usuario = usuarioRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    return clienteDetalleMapper.toDTO(usuario);
}

public List<Usuario> obtenerClientesActivos() {
        return usuarioRepository.findByActivoTrueAndTipo(TipoUsuario.CLIENTE);
    }
    
public Usuario guardarUsuario(Usuario usuario) {
    // La contraseña se generará automáticamente en prePersist
    return usuarioRepository.save(usuario);
}

    public List<Usuario> obtenerTodos() {
        return new ArrayList<>(usuarioRepository.findAll());
    }
    
    public boolean existeEmail(String email) {
        return usuarioRepository.findByEmail(email).isPresent();
    }

    @Transactional
    public UsuarioDTO cambiarEstado(Long id, boolean activo) {
        try {
            Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
            
            usuario.setActivo(activo);
            Usuario usuarioActualizado = usuarioRepository.save(usuario);
            usuarioRepository.flush();
            
            // Convertir a DTO antes de devolver
            return usuarioMapper.toDTO(usuarioActualizado);
        } catch (Exception e) {
            throw new RuntimeException("Error al cambiar estado: " + e.getMessage());
        }
    }

    @Transactional
public void eliminarUsuario(Long id) {
    Usuario usuario = usuarioRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    
    // Primero eliminar los registros relacionados
    cajaIngresoRepository.deleteByClienteId(id);
    // Luego eliminar el usuario
    usuarioRepository.delete(usuario);
}

    public String obtenerCredenciales(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
            
        return String.format("Email: %s\nContraseña: %s", 
            usuario.getEmail(), 
            usuario.getPassword());
    }
}