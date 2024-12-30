package com.gimnasio.gestion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gimnasio.gestion.model.Membresia;
import com.gimnasio.gestion.service.MembresiaService;

@RestController
@RequestMapping("/api/membresias")
public class MembresiaController {
    @Autowired
    private MembresiaService membresiaService;
    
    @PostMapping
    public ResponseEntity<Membresia> crearMembresia(@RequestBody Membresia membresia) {
        return ResponseEntity.ok(membresiaService.crearMembresia(membresia));
    }
}