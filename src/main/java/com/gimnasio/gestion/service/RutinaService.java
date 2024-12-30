package com.gimnasio.gestion.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gimnasio.gestion.model.Rutina;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.RutinaRepository;

@Service
@Transactional
public class RutinaService {
    @Autowired
    private RutinaRepository rutinaRepository;
    
    public Rutina crearRutina(Rutina rutina) {
        return rutinaRepository.save(rutina);
    }
    
    public List<Rutina> obtenerRutinasCliente(Usuario cliente) {
        return rutinaRepository.findByCliente(cliente);
    }
}