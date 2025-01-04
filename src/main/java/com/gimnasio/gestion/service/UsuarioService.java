package com.gimnasio.gestion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import com.gimnasio.gestion.dto.ClienteDetalleDTO;
import com.gimnasio.gestion.enums.TipoUsuario;
import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.mapper.ClienteDetalleMapper;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.UsuarioRepository;

@Service
@Transactional
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
private ClienteDetalleMapper clienteDetalleMapper;

public ClienteDetalleDTO obtenerDetalleCliente(Long id) {
    Usuario usuario = usuarioRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    return clienteDetalleMapper.toDTO(usuario);
}
    
    public Usuario guardarUsuario(Usuario usuario) {
        // Si es un cliente, establecer una contraseña por defecto o null
        if (usuario.getTipo() == TipoUsuario.CLIENTE) {
            usuario.setPassword(null); // O establecer una contraseña por defecto
        }
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> obtenerTodos() {
        return new ArrayList<>(usuarioRepository.findAll());
    }
    
    public boolean existeEmail(String email) {
        return usuarioRepository.findByEmail(email).isPresent();
    }

    @Transactional
public Usuario cambiarEstado(Long id, boolean activo) {
    try {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        usuario.setActivo(activo);
        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        usuarioRepository.flush(); // Forzar la actualización en la base de datos
        
        return usuarioActualizado;
    } catch (Exception e) {
        e.printStackTrace(); // Para ver el error en los logs
        throw new RuntimeException("Error al cambiar estado: " + e.getMessage());
    }
}

    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
            
        try {
            usuarioRepository.delete(usuario);
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar usuario: " + e.getMessage());
        }
    }
}