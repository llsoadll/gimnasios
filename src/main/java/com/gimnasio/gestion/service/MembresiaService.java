package com.gimnasio.gestion.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.model.Membresia;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.MembresiaRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;

@Service
@Transactional
public class MembresiaService {
    @Autowired
    private MembresiaRepository membresiaRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public List<Membresia> obtenerTodas() {
        return membresiaRepository.findAll();
    }

    public void eliminarMembresia(Long id) {
        membresiaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Membresía no encontrada"));
        membresiaRepository.deleteById(id);
    }
    
    public Membresia crearMembresia(Membresia membresia) {
        if (membresia.getCliente() == null || membresia.getCliente().getId() == null) {
            throw new ResourceNotFoundException("Cliente no especificado");
        }
    
        Usuario cliente = usuarioRepository.findById(membresia.getCliente().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
            
        membresia.setCliente(cliente);
        
        LocalDate fechaInicio = membresia.getFechaInicio();
        if (fechaInicio == null) {
            fechaInicio = LocalDate.now();
            membresia.setFechaInicio(fechaInicio);
        }
        
        // Calcular fecha fin según tipo
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
        
        Membresia nuevaMembresia = membresiaRepository.save(membresia);
        // Forzar la carga del cliente
        nuevaMembresia.getCliente().getNombre();
            return nuevaMembresia;
        }
    }