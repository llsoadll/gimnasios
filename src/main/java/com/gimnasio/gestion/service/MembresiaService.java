package com.gimnasio.gestion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gimnasio.gestion.model.Membresia;
import com.gimnasio.gestion.repository.MembresiaRepository;

@Service
@Transactional
public class MembresiaService {
    @Autowired
    private MembresiaRepository membresiaRepository;
    
    public Membresia crearMembresia(Membresia membresia) {
        // Calcular fechaFin basado en tipo
        switch(membresia.getTipo()) {
            case MENSUAL:
                membresia.setFechaFin(membresia.getFechaInicio().plusMonths(1));
                break;
            case TRIMESTRAL:
                membresia.setFechaFin(membresia.getFechaInicio().plusMonths(3));
                break;
            case ANUAL:
                membresia.setFechaFin(membresia.getFechaInicio().plusYears(1));
                break;
        }
        return membresiaRepository.save(membresia);
    }
}