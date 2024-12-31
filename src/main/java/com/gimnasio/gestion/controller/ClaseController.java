package com.gimnasio.gestion.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gimnasio.gestion.model.Clase;
import com.gimnasio.gestion.service.ClaseService;

@RestController
@RequestMapping("/api/clases")
public class ClaseController {
    @Autowired
    private ClaseService claseService;
    
    @GetMapping
    public ResponseEntity<List<Clase>> obtenerClases() {
        List<Clase> clases = claseService.obtenerTodas();
        // Forzar la carga del entrenador
        clases.forEach(clase -> {
            if (clase.getEntrenador() != null) {
                clase.getEntrenador().getNombre();
            }
        });
        return ResponseEntity.ok(clases);
    }

    @PostMapping
    public ResponseEntity<Clase> crearClase(@RequestBody Clase clase) {
        return ResponseEntity.ok(claseService.crearClase(clase));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarClase(@PathVariable Long id) {
        claseService.eliminarClase(id);
        return ResponseEntity.noContent().build();
    }
}