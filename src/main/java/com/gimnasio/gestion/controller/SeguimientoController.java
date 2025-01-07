package com.gimnasio.gestion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gimnasio.gestion.model.Seguimiento;
import com.gimnasio.gestion.service.SeguimientoService;
import java.util.List;

@RestController
@RequestMapping("/api/seguimientos")
public class SeguimientoController {
    @Autowired
    private SeguimientoService seguimientoService;
    
    @PostMapping
    public ResponseEntity<Seguimiento> registrarSeguimiento(@RequestBody Seguimiento seguimiento) {
        return ResponseEntity.ok(seguimientoService.guardar(seguimiento));
    }
    
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Seguimiento>> obtenerHistorial(@PathVariable Long clienteId) {
        return ResponseEntity.ok(seguimientoService.obtenerHistorialCliente(clienteId));
    }

    @DeleteMapping("/{id}")
public ResponseEntity<Void> eliminarSeguimiento(@PathVariable Long id) {
    seguimientoService.eliminarSeguimiento(id);
    return ResponseEntity.noContent().build();
}
}