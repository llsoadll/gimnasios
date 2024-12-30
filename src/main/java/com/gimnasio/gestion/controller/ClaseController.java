package com.gimnasio.gestion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gimnasio.gestion.model.Clase;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.service.ClaseService;

@RestController
@RequestMapping("/api/clases")
public class ClaseController {
    @Autowired
    private ClaseService claseService;
    
    @PostMapping
    public ResponseEntity<Clase> programarClase(@RequestBody Clase clase) {
        return ResponseEntity.ok(claseService.programarClase(clase));
    }
    
    @PostMapping("/{claseId}/inscripcion")
    public ResponseEntity<?> inscribirseEnClase(@PathVariable Long claseId, @RequestBody Usuario usuario) {
        claseService.inscribirseEnClase(claseId, usuario);
        return ResponseEntity.ok().build();
    }
}