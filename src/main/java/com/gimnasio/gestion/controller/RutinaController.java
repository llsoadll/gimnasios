package com.gimnasio.gestion.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gimnasio.gestion.dto.RutinaDTO;
import com.gimnasio.gestion.dto.RutinaTemplateDTO;
import com.gimnasio.gestion.service.RutinaService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/rutinas")  // Make sure this matches exactly
@CrossOrigin(origins = "http://localhost:3000")
public class RutinaController {
    @Autowired
    private RutinaService rutinaService;
    
    @PostMapping
    public ResponseEntity<RutinaDTO> crearRutina(@RequestBody RutinaDTO rutinaDTO) {
        try {
            if (rutinaDTO.getEntrenador() == null || rutinaDTO.getEntrenador().getId() == null) {
                return ResponseEntity.badRequest().build();
            }
            RutinaDTO nuevaRutina = rutinaService.crearRutina(rutinaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaRutina);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<RutinaDTO>> obtenerRutinas() {
        return ResponseEntity.ok(rutinaService.obtenerTodas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRutina(@PathVariable Long id) {
        rutinaService.eliminarRutina(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cliente/{clienteId}")
public ResponseEntity<List<RutinaDTO>> obtenerRutinasCliente(@PathVariable Long clienteId) {
    return ResponseEntity.ok(rutinaService.obtenerRutinasCliente(clienteId));
}

// Endpoint para templates
@PostMapping("/templates")
public ResponseEntity<RutinaTemplateDTO> crearTemplate(@RequestBody RutinaTemplateDTO dto) {
    try {
        log.debug("Recibiendo solicitud para crear template: {}", dto);
        RutinaTemplateDTO nuevoTemplate = rutinaService.crearTemplate(dto);
        log.debug("Template creado exitosamente: {}", nuevoTemplate);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTemplate);
    } catch (Exception e) {
        log.error("Error al crear template:", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

@GetMapping("/templates")
public ResponseEntity<List<RutinaTemplateDTO>> obtenerTemplates() {
    return ResponseEntity.ok(rutinaService.obtenerTemplates());
}
    
    @PostMapping("/templates/{templateId}/asignar/{clienteId}")
    public ResponseEntity<RutinaDTO> asignarRutina(
        @PathVariable Long templateId,
        @PathVariable Long clienteId
    ) {
        return ResponseEntity.ok(rutinaService.asignarRutina(templateId, clienteId));
    }

    @DeleteMapping("/templates/{id}")
    public ResponseEntity<Void> eliminarTemplate(@PathVariable Long id) {
        rutinaService.eliminarTemplate(id);
        return ResponseEntity.noContent().build();
    }

@PutMapping("/{id}")
public ResponseEntity<RutinaDTO> actualizarRutina(@PathVariable Long id, @RequestBody RutinaDTO rutinaDTO) {
    rutinaDTO.setId(id);
    return ResponseEntity.ok(rutinaService.actualizarRutina(rutinaDTO));
}




}