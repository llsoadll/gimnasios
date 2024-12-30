package com.gimnasio.gestion.service;

import com.gimnasio.gestion.model.Rutina;
import com.gimnasio.gestion.repository.RutinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RutinaService {
    @Autowired
    private RutinaRepository rutinaRepository;

    public Rutina crearRutina(Rutina rutina) {
        return rutinaRepository.save(rutina);
    }

    public List<Rutina> obtenerTodas() {
        return rutinaRepository.findAll();
    }

    public void eliminarRutina(Long id) {
        rutinaRepository.deleteById(id);
    }
}