package com.gimnasio.gestion.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gimnasio.gestion.service.CajaService;

@RestController
@RequestMapping("/api/caja")
@CrossOrigin(origins = "http://localhost:3000")
public class CajaController {
    @Autowired
    private CajaService cajaService;
    
    @GetMapping("/ingresos")
    public ResponseEntity<List<Map<String, Object>>> obtenerIngresos(
        @RequestParam LocalDate inicio, 
        @RequestParam LocalDate fin) {
        return ResponseEntity.ok(cajaService.obtenerIngresosPorPeriodo(inicio, fin));
    }
    
    @GetMapping("/diario")
    public ResponseEntity<Double> obtenerTotalDiario(@RequestParam LocalDate fecha) {
        return ResponseEntity.ok(cajaService.obtenerTotalDiario(fecha));
    }
    
    @GetMapping("/mensual")
    public ResponseEntity<Double> obtenerTotalMensual(@RequestParam int anio, @RequestParam int mes) {
        return ResponseEntity.ok(cajaService.obtenerTotalMensual(anio, mes));
    }
    
    @GetMapping("/anual")
    public ResponseEntity<Double> obtenerTotalAnual(@RequestParam int anio) {
        return ResponseEntity.ok(cajaService.obtenerTotalAnual(anio));
    }
}