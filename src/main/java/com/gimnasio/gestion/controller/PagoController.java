package com.gimnasio.gestion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.gimnasio.gestion.dto.PagoDTO;
import com.gimnasio.gestion.service.PagoService;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {
    @Autowired
    private PagoService pagoService;
    
    @PostMapping
    public ResponseEntity<PagoDTO> registrarPago(@RequestBody PagoDTO pagoDTO) {
        return ResponseEntity.ok(pagoService.registrarPago(pagoDTO));
    }
    
    @GetMapping
    public ResponseEntity<List<PagoDTO>> obtenerTodos() {
        return ResponseEntity.ok(pagoService.obtenerTodos());
    }
    
    @GetMapping("/membresia/{membresiaId}")
    public ResponseEntity<List<PagoDTO>> obtenerPagosPorMembresia(@PathVariable Long membresiaId) {
        return ResponseEntity.ok(pagoService.obtenerPagosPorMembresia(membresiaId));
    }
}