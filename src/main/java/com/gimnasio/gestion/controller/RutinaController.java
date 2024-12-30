package com.gimnasio.gestion.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gimnasio.gestion.model.Rutina;
import com.gimnasio.gestion.service.RutinaService;

@RestController
@RequestMapping("/api/rutinas")
public class RutinaController {
    @Autowired
    private RutinaService rutinaService;
    
    @PostMapping
    public ResponseEntity<Rutina> crearRutina(@RequestBody Rutina rutina) {
        return ResponseEntity.ok(rutinaService.crearRutina(rutina));
    }
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Rutina>> obtenerRutinasCliente(@PathVariable Long clienteId) {
        // Implementar lógica
        return ResponseEntity.ok(new ArrayList<Rutina>());
    }
}