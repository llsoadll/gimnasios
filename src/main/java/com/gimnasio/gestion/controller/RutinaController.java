package com.gimnasio.gestion.controller;

import com.gimnasio.gestion.dto.RutinaDTO;
import com.gimnasio.gestion.service.RutinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rutinas")
public class RutinaController {
    @Autowired
    private RutinaService rutinaService;
    
    @PostMapping
    public ResponseEntity<RutinaDTO> crearRutina(@RequestBody RutinaDTO rutinaDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rutinaService.crearRutina(rutinaDTO));
    }
    
    @GetMapping
    public ResponseEntity<List<RutinaDTO>> obtenerRutinas() {
        return ResponseEntity.ok(rutinaService.obtenerTodas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRutina(@PathVariable Long id) {
        rutinaService.eliminarRutina(id);
        return ResponseEntity.noContent().build();
    }
}