package com.gimnasio.gestion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.gimnasio.gestion.dto.MembresiaDTO;
import com.gimnasio.gestion.service.MembresiaService;

@RestController
@RequestMapping("/api/membresias")
public class MembresiaController {
    @Autowired
    private MembresiaService membresiaService;

    @GetMapping
    public ResponseEntity<List<MembresiaDTO>> obtenerMembresias() {
        return ResponseEntity.ok(membresiaService.obtenerTodas());
    }

    @PostMapping
    public ResponseEntity<MembresiaDTO> crearMembresia(@RequestBody MembresiaDTO membresiaDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(membresiaService.crearMembresia(membresiaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMembresia(@PathVariable Long id) {
        membresiaService.eliminarMembresia(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sin-pagar")
    public ResponseEntity<List<MembresiaDTO>> obtenerMembresiasSinPagar() {
        return ResponseEntity.ok(membresiaService.obtenerMembresiasSinPagar());
    }
}