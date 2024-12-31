package com.gimnasio.gestion.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.model.Clase;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.ClaseRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;

@Service
@Transactional
public class ClaseService {
    @Autowired
    private ClaseRepository claseRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Clase> obtenerTodas() {
        return claseRepository.findAll();
    }

    public Clase crearClase(Clase clase) {
        if (clase.getEntrenador() != null && clase.getEntrenador().getId() != null) {
            Usuario entrenador = usuarioRepository.findById(clase.getEntrenador().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Entrenador no encontrado"));
            clase.setEntrenador(entrenador);
        }
        return claseRepository.save(clase);
    }

    public void eliminarClase(Long id) {
        claseRepository.deleteById(id);
    }
}