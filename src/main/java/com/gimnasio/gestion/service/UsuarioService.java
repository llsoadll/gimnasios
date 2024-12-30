package com.gimnasio.gestion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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
}