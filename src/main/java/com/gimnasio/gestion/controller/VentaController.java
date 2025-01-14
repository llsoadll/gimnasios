package com.gimnasio.gestion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.gimnasio.gestion.service.VentaService;
import com.gimnasio.gestion.dto.VentaDTO;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:3000")
public class VentaController {
    
    @Autowired
    private VentaService ventaService;

    @GetMapping
    public ResponseEntity<List<VentaDTO>> obtenerVentas() {
        try {
            List<VentaDTO> ventas = ventaService.obtenerVentas();
            return ResponseEntity.ok(ventas);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}