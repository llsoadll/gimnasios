package com.gimnasio.gestion.controller;

import com.gimnasio.gestion.model.Rutina;
import com.gimnasio.gestion.service.RutinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rutinas")
public class RutinaController {
    @Autowired
    private RutinaService rutinaService;

    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8"})
    public ResponseEntity<Rutina> crearRutina(@RequestBody Rutina rutina) {
        return ResponseEntity.ok(rutinaService.crearRutina(rutina));
    }

    @GetMapping
    public ResponseEntity<List<Rutina>> obtenerRutinas() {
        return ResponseEntity.ok(rutinaService.obtenerTodas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRutina(@PathVariable Long id) {
        rutinaService.eliminarRutina(id);
        return ResponseEntity.noContent().build();
    }
}