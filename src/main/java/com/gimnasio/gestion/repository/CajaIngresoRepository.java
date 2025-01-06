package com.gimnasio.gestion.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.model.CajaIngreso;

@Repository
public interface CajaIngresoRepository extends JpaRepository<CajaIngreso, Long> {
    @Query("SELECT new map(c.fecha as fecha, c.monto as monto, " +
           "c.concepto as concepto, c.cliente.nombre as clienteNombre, " +
           "c.cliente.apellido as clienteApellido) " +
           "FROM CajaIngreso c WHERE c.fecha BETWEEN :inicio AND :fin")
    List<Map<String, Object>> findIngresosByFechaBetween(
        @Param("inicio") LocalDate inicio, 
        @Param("fin") LocalDate fin
    );
    
    @Query("SELECT COALESCE(SUM(c.monto), 0) FROM CajaIngreso c WHERE c.fecha = :fecha")
    Double obtenerTotalDiario(@Param("fecha") LocalDate fecha);
    
    @Query("SELECT COALESCE(SUM(c.monto), 0) FROM CajaIngreso c WHERE YEAR(c.fecha) = :anio AND MONTH(c.fecha) = :mes")
    Double obtenerTotalMensual(@Param("anio") int anio, @Param("mes") int mes);
    
    @Query("SELECT COALESCE(SUM(c.monto), 0) FROM CajaIngreso c WHERE YEAR(c.fecha) = :anio")
    Double obtenerTotalAnual(@Param("anio") int anio);
}
