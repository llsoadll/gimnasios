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

import com.gimnasio.gestion.model.CajaIngreso;
import com.gimnasio.gestion.repository.CajaIngresoRepository;
import com.gimnasio.gestion.service.CajaService;

@RestController
@RequestMapping("/api/caja")
@CrossOrigin(origins = "http://localhost:3000")
public class CajaController {
    @Autowired
    private CajaService cajaService;

    @Autowired
    private CajaIngresoRepository cajaIngresoRepository;
    
    @GetMapping("/ingresos")
    public ResponseEntity<List<Map<String, Object>>> obtenerIngresos(
        @RequestParam LocalDate inicio, 
        @RequestParam LocalDate fin) {
        return ResponseEntity.ok(cajaService.obtenerIngresosPorPeriodo(inicio, fin));
    }
    
    @GetMapping("/diario")
public ResponseEntity<Double> obtenerTotalDiario(@RequestParam LocalDate fecha) {
    System.out.println("Fecha recibida en controller: " + fecha); // Agregar este log
    Double total = cajaService.obtenerTotalDiario(fecha);
    System.out.println("Total calculado: " + total); // Agregar este log
    return ResponseEntity.ok(total);
}

// Endpoint adicional para debug
@GetMapping("/ingresos-dia")
public ResponseEntity<List<CajaIngreso>> obtenerIngresosDia(@RequestParam LocalDate fecha) {
    return ResponseEntity.ok(cajaIngresoRepository.findByFecha(fecha));
}
    
    @GetMapping("/mensual")
    public ResponseEntity<Double> obtenerTotalMensual(@RequestParam int anio, @RequestParam int mes) {
        return ResponseEntity.ok(cajaService.obtenerTotalMensual(anio, mes));
    }
    
    @GetMapping("/anual")
    public ResponseEntity<Double> obtenerTotalAnual(@RequestParam int anio) {
        return ResponseEntity.ok(cajaService.obtenerTotalAnual(anio));
    }

    @GetMapping("/debug")
    public ResponseEntity<?> debugCaja() {
        List<Object[]> registros = cajaIngresoRepository.findAllWithDetails();
        System.out.println("Todos los registros en caja:");
        for (Object[] registro : registros) {
            System.out.println("Fecha: " + registro[0] + 
                             ", Monto: " + registro[1] + 
                             ", Concepto: " + registro[2]);
        }
        return ResponseEntity.ok().build();
    }

    
}