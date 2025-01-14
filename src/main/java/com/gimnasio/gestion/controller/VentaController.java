package com.gimnasio.gestion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.gimnasio.gestion.model.Venta;
import com.gimnasio.gestion.repository.VentaRepository;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:3000")
public class VentaController {
    @Autowired
    private VentaRepository ventaRepository;
    
    @GetMapping
public ResponseEntity<List<Venta>> obtenerVentas() {
    return ResponseEntity.ok(ventaRepository.findAllByOrderByFechaDesc());
}
}
