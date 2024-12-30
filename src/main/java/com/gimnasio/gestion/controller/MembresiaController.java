package com.gimnasio.gestion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.gimnasio.gestion.model.Membresia;
import com.gimnasio.gestion.service.MembresiaService;

@RestController
@RequestMapping("/api/membresias")
public class MembresiaController {
    @Autowired
    private MembresiaService membresiaService;

    @GetMapping
    public ResponseEntity<List<Membresia>> obtenerMembresias() {
        return ResponseEntity.ok(membresiaService.obtenerTodas());
    }

    @PostMapping
    public ResponseEntity<Membresia> crearMembresia(@RequestBody Membresia membresia) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(membresiaService.crearMembresia(membresia));
    }
}