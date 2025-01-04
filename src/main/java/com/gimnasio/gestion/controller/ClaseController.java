package com.gimnasio.gestion.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gimnasio.gestion.dto.ClaseDTO;
import com.gimnasio.gestion.model.InscripcionClase;
import com.gimnasio.gestion.service.ClaseService;

@RestController
@RequestMapping("/api/clases")
public class ClaseController {
    @Autowired
    private ClaseService claseService;
    
    @GetMapping
    public ResponseEntity<List<ClaseDTO>> obtenerClases() {
        return ResponseEntity.ok(claseService.obtenerTodas());
    }

    @PostMapping
    public ResponseEntity<ClaseDTO> crearClase(@RequestBody ClaseDTO claseDTO) {
        return ResponseEntity.ok(claseService.crearClase(claseDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarClase(@PathVariable Long id) {
        claseService.eliminarClase(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{claseId}/inscribir/{clienteId}")
    public ResponseEntity<InscripcionClase> inscribirCliente(
            @PathVariable Long claseId,
            @PathVariable Long clienteId) {
        return ResponseEntity.ok(claseService.inscribirCliente(claseId, clienteId));
    }
    
    @PostMapping("/inscripciones/{inscripcionId}/cancelar")
    public ResponseEntity<Void> cancelarInscripcion(@PathVariable Long inscripcionId) {
        claseService.cancelarInscripcion(inscripcionId);
        return ResponseEntity.noContent().build();
    }
}