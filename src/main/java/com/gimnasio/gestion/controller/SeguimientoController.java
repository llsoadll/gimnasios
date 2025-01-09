package com.gimnasio.gestion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gimnasio.gestion.dto.SeguimientoDTO;
import com.gimnasio.gestion.model.Seguimiento;
import com.gimnasio.gestion.service.SeguimientoService;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seguimientos")
@CrossOrigin(origins = "http://localhost:3000")
public class SeguimientoController {
    @Autowired
    private SeguimientoService seguimientoService;
    
    @PostMapping
    public ResponseEntity<Seguimiento> registrarSeguimiento(@RequestBody Seguimiento seguimiento) {
        return ResponseEntity.ok(seguimientoService.guardar(seguimiento));
    }
    
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<?> obtenerHistorial(@PathVariable Long clienteId) {
        try {
            List<Seguimiento> seguimientos = seguimientoService.obtenerHistorialCliente(clienteId);
            List<SeguimientoDTO> seguimientosDTO = seguimientos.stream()
                .map(s -> {
                    SeguimientoDTO dto = new SeguimientoDTO();
                    dto.setId(s.getId());
                    dto.setFecha(s.getFecha());
                    dto.setPeso(s.getPeso());
                    dto.setAltura(s.getAltura());
                    dto.setImc(s.getImc());
                    dto.setObservaciones(s.getObservaciones());
                    dto.setClienteId(s.getCliente().getId());
                    return dto;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(seguimientosDTO);
        } catch (Exception e) {
            e.printStackTrace(); // Para ver el error completo en los logs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al obtener seguimientos: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
public ResponseEntity<Void> eliminarSeguimiento(@PathVariable Long id) {
    seguimientoService.eliminarSeguimiento(id);
    return ResponseEntity.noContent().build();
}
}