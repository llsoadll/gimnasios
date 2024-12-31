package com.gimnasio.gestion.service;

import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.model.Rutina;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.RutinaRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RutinaService {
    @Autowired
    private RutinaRepository rutinaRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    public Rutina crearRutina(Rutina rutina) {
        // Cargar cliente y entrenador completos
        Usuario cliente = usuarioRepository.findById(rutina.getCliente().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
        Usuario entrenador = usuarioRepository.findById(rutina.getEntrenador().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Entrenador no encontrado"));
        
        rutina.setCliente(cliente);
        rutina.setEntrenador(entrenador);
        
        // Actualizar las listas de rutinas
        cliente.getRutinas().add(rutina);
        entrenador.getRutinasComoEntrenador().add(rutina);
        
        // Guardar la rutina
        Rutina rutinaGuardada = rutinaRepository.save(rutina);
        
        // Actualizar usuarios
        usuarioRepository.save(cliente);
        usuarioRepository.save(entrenador);
        
        return rutinaGuardada;
    }

    public List<Rutina> obtenerTodas() {
        return rutinaRepository.findAll();
    }

    public void eliminarRutina(Long id) {
        rutinaRepository.deleteById(id);
    }
}