package com.gimnasio.gestion.service;

import com.gimnasio.gestion.dto.RutinaDTO;
import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.mapper.RutinaMapper;
import com.gimnasio.gestion.model.Rutina;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.RutinaRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RutinaService {
    @Autowired
    private RutinaRepository rutinaRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private RutinaMapper rutinaMapper;
    
    public RutinaDTO crearRutina(RutinaDTO rutinaDTO) {
        Rutina rutina = rutinaMapper.toEntity(rutinaDTO);
        
        Usuario cliente = usuarioRepository.findById(rutina.getCliente().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
        Usuario entrenador = usuarioRepository.findById(rutina.getEntrenador().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Entrenador no encontrado"));
        
        rutina.setCliente(cliente);
        rutina.setEntrenador(entrenador);
        
        Rutina rutinaGuardada = rutinaRepository.save(rutina);
        return rutinaMapper.toDTO(rutinaGuardada);
    }
    
    public List<RutinaDTO> obtenerTodas() {
        return rutinaRepository.findAll().stream()
            .map(rutinaMapper::toDTO)
            .collect(Collectors.toList());
    }

    public void eliminarRutina(Long id) {
        rutinaRepository.deleteById(id);
    }
}