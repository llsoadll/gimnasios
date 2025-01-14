package com.gimnasio.gestion.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gimnasio.gestion.dto.MembresiaDTO;
import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.mapper.MembresiaMapper;
import com.gimnasio.gestion.model.Membresia;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.MembresiaRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;

@Service
@EnableScheduling
@Transactional
public class MembresiaService {
    @Autowired
    private MembresiaRepository membresiaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private MembresiaMapper membresiaMapper;
    
    public List<MembresiaDTO> obtenerTodas() {
        return membresiaRepository.findAll().stream()
            .map(membresiaMapper::toDTO)
            .collect(Collectors.toList());
    }

    public MembresiaDTO crearMembresia(MembresiaDTO membresiaDTO) {
        Membresia membresia = membresiaMapper.toEntity(membresiaDTO);
        
        Usuario cliente = usuarioRepository.findById(membresia.getCliente().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
            
        membresia.setCliente(cliente);
        
        LocalDate fechaInicio = membresia.getFechaInicio();
        if (fechaInicio == null) {
            fechaInicio = LocalDate.now();
            membresia.setFechaInicio(fechaInicio);
        }
        
        // Calcular fecha fin según tipo de membresía
        switch(membresia.getTipo()) {
            case MENSUAL:
                membresia.setFechaFin(fechaInicio.plusMonths(1));
                break;
            case TRIMESTRAL:
                membresia.setFechaFin(fechaInicio.plusMonths(3));
                break;
            case ANUAL:
                membresia.setFechaFin(fechaInicio.plusYears(1));
                break;
            default:
                throw new IllegalArgumentException("Tipo de membresía no válido");
        }
        
        membresia.setActiva(true);
        Membresia nuevaMembresia = membresiaRepository.save(membresia);
        return membresiaMapper.toDTO(nuevaMembresia);
    }

    public MembresiaDTO actualizarMembresia(MembresiaDTO membresiaDTO) {
        Membresia membresia = membresiaRepository.findById(membresiaDTO.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Membresía no encontrada"));
        
        Usuario cliente = usuarioRepository.findById(membresiaDTO.getCliente().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
            
        membresia.setCliente(cliente);
        membresia.setFechaInicio(membresiaDTO.getFechaInicio());
        membresia.setPrecio(membresiaDTO.getPrecio());
        membresia.setTipo(membresiaDTO.getTipo());
        membresia.setActiva(membresiaDTO.isActiva());
        
        // Recalcular fecha fin según tipo
        LocalDate fechaInicio = membresia.getFechaInicio();
        switch(membresia.getTipo()) {
            case MENSUAL:
                membresia.setFechaFin(fechaInicio.plusMonths(1));
                break;
            case TRIMESTRAL:
                membresia.setFechaFin(fechaInicio.plusMonths(3));
                break;
            case ANUAL:
                membresia.setFechaFin(fechaInicio.plusYears(1));
                break;
        }
        
        Membresia membresiaActualizada = membresiaRepository.save(membresia);
        return membresiaMapper.toDTO(membresiaActualizada);
    }


    public List<MembresiaDTO> obtenerMembresiasSinPagar() {
        return membresiaRepository.findMembresiasSinPagar().stream()
            .filter(membresia -> membresia.isActiva()) // Solo membresías activas
            .filter(membresia -> !tienePagos(membresia)) // Solo las que no tienen pagos
            .map(membresiaMapper::toDTO)
            .collect(Collectors.toList());
    }

    private boolean tienePagos(Membresia membresia) {
        return membresia.getPagos() != null && 
               !membresia.getPagos().isEmpty();
    }

    public void eliminarMembresia(Long id) {
        Membresia membresia = membresiaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Membresía no encontrada"));
        membresiaRepository.delete(membresia);
    }

    @Scheduled(cron = "0 0 0 * * *") // Se ejecuta todos los días a las 00:00
public void actualizarEstadoMembresias() {
    // Busca todas las membresías que están activas pero su fecha fin ya pasó
    List<Membresia> membresiasExpiradas = membresiaRepository.findByActivaTrueAndFechaFinBefore(LocalDate.now());
    
    // Para cada membresía expirada
    membresiasExpiradas.forEach(membresia -> {
        membresia.setActiva(false);  // La marca como inactiva
        membresiaRepository.save(membresia);  // Guarda los cambios
    });
}
}