package com.gimnasio.gestion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.UsuarioRepository;

@Service
@Transactional
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public Usuario guardarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> obtenerTodos() {
        return new ArrayList<>(usuarioRepository.findAll());
    }
    
    public boolean existeEmail(String email) {
        return usuarioRepository.findByEmail(email).isPresent();
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