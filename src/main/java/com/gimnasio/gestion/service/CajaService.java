package com.gimnasio.gestion.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import com.gimnasio.gestion.repository.CajaIngresoRepository;

@Service
@Transactional
public class CajaService {
    @Autowired
    private CajaIngresoRepository cajaIngresoRepository;
    
    public Double obtenerTotalDiario(LocalDate fecha) {
        System.out.println("Consultando total para fecha: " + fecha);
        Double total = cajaIngresoRepository.obtenerTotalDiario(fecha);
        System.out.println("Total obtenido: " + total);
        return total;
    }
    
    public Double obtenerTotalMensual(int anio, int mes) {
        return cajaIngresoRepository.obtenerTotalMensual(anio, mes);
    }
    
    public Double obtenerTotalAnual(int anio) {
        return cajaIngresoRepository.obtenerTotalAnual(anio);
    }
    
    public List<Map<String, Object>> obtenerIngresosPorPeriodo(LocalDate inicio, LocalDate fin) {
        return cajaIngresoRepository.findIngresosByFechaBetween(inicio, fin);
    }
}