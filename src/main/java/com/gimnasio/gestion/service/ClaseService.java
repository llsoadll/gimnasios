package com.gimnasio.gestion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gimnasio.gestion.model.Clase;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.ClaseRepository;

@Service
@Transactional
public class ClaseService {
    @Autowired
    private ClaseRepository claseRepository;
    
    public Clase programarClase(Clase clase) {
        return claseRepository.save(clase);
    }
    
    public boolean inscribirseEnClase(Long claseId, Usuario usuario) {
        // Lógica para inscribirse en una clase
        return true;
    }
}