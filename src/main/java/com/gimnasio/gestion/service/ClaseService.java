package com.gimnasio.gestion.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gimnasio.gestion.dto.ClaseDTO;
import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.mapper.ClaseMapper;
import com.gimnasio.gestion.model.Clase;
import com.gimnasio.gestion.model.InscripcionClase;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.ClaseRepository;
import com.gimnasio.gestion.repository.InscripcionClaseRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;

@Service
@Transactional
public class ClaseService {
    @Autowired
    private ClaseRepository claseRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private InscripcionClaseRepository inscripcionClaseRepository;
    
    @Autowired
    private ClaseMapper claseMapper;

    public void eliminarClase(Long id) {
        Clase clase = claseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada"));
            
        // Primero eliminar todas las inscripciones asociadas
        List<InscripcionClase> inscripciones = inscripcionClaseRepository.findByClase(clase);
        inscripcionClaseRepository.deleteAll(inscripciones);
        
        // Luego eliminar la clase
        claseRepository.delete(clase);
    }

    public InscripcionClase inscribirCliente(Long claseId, Long clienteId) {
        try {
            Clase clase = claseRepository.findById(claseId)
                .orElseThrow(() -> new ResourceNotFoundException("Clase no encontrada"));
                
            Usuario cliente = usuarioRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));

            // Verificar si ya está inscrito
            boolean yaInscrito = inscripcionClaseRepository.existsByClaseAndClienteAndActivaTrue(clase, cliente);
            if (yaInscrito) {
                throw new RuntimeException("El cliente ya está inscrito en esta clase");
            }

            // Verificar cupos disponibles
            if (!clase.tieneEspacioDisponible()) {
                throw new RuntimeException("No hay cupos disponibles en esta clase");
            }

            InscripcionClase inscripcion = new InscripcionClase();
            inscripcion.setClase(clase);
            inscripcion.setCliente(cliente);
            inscripcion.setActiva(true);
            inscripcion.setFechaInscripcion(LocalDateTime.now());
            
            return inscripcionClaseRepository.save(inscripcion);
        } catch (Exception e) {
            throw new RuntimeException("Error al inscribir cliente: " + e.getMessage());
        }
    }

    public void cancelarInscripcion(Long inscripcionId) {
        InscripcionClase inscripcion = inscripcionClaseRepository.findById(inscripcionId)
            .orElseThrow(() -> new ResourceNotFoundException("Inscripción no encontrada"));
        inscripcion.setActiva(false);
        inscripcionClaseRepository.save(inscripcion);
    }

    public List<ClaseDTO> obtenerTodas() {
        return claseRepository.findAll().stream()
            .map(claseMapper::toDTO)
            .collect(Collectors.toList());
    }

    public ClaseDTO crearClase(ClaseDTO claseDTO) {
        Clase clase = new Clase();
        clase.setNombre(claseDTO.getNombre());
        clase.setDescripcion(claseDTO.getDescripcion());
        clase.setDia(claseDTO.getDia());
        clase.setHorario(claseDTO.getHorario());
        clase.setCupo(claseDTO.getCupo());
        
        if (claseDTO.getEntrenador() != null) {
            Usuario entrenador = usuarioRepository.findById(claseDTO.getEntrenador().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Entrenador no encontrado"));
            clase.setEntrenador(entrenador);
        }
        
        Clase claseGuardada = claseRepository.save(clase);
        return claseMapper.toDTO(claseGuardada);
    }
}