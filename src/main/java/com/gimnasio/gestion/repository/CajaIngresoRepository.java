package com.gimnasio.gestion.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.model.CajaIngreso;
import com.gimnasio.gestion.model.Pago;

@Repository
public interface CajaIngresoRepository extends JpaRepository<CajaIngreso, Long> {
    @Query(value = "SELECT COALESCE(SUM(monto), 0) FROM caja_ingresos WHERE DATE(fecha) = DATE(:fecha)", nativeQuery = true)
Double obtenerTotalDiario(@Param("fecha") LocalDate fecha);

    // Para verificar los registros de un día específico
    @Query(value = "SELECT * FROM caja_ingresos WHERE DATE(fecha) = ?1", nativeQuery = true)
    List<CajaIngreso> findByFecha(LocalDate fecha);

    @Query(value = "SELECT CAST(fecha AS DATE) as fecha, monto, concepto FROM caja_ingresos", nativeQuery = true)
    List<Object[]> findAllWithDetails();

    @Query("SELECT COALESCE(SUM(c.monto), 0) FROM CajaIngreso c WHERE EXTRACT(YEAR FROM c.fecha) = :anio AND EXTRACT(MONTH FROM c.fecha) = :mes")
    Double obtenerTotalMensual(@Param("anio") int anio, @Param("mes") int mes);
    
    @Query("SELECT COALESCE(SUM(c.monto), 0) FROM CajaIngreso c WHERE EXTRACT(YEAR FROM c.fecha) = :anio")
    Double obtenerTotalAnual(@Param("anio") int anio);

    @Query("SELECT new map(c.fecha as fecha, c.monto as monto, " +
           "c.concepto as concepto, c.cliente.nombre as clienteNombre, " +
           "c.cliente.apellido as clienteApellido) " +
           "FROM CajaIngreso c WHERE c.fecha BETWEEN :inicio AND :fin")
    List<Map<String, Object>> findIngresosByFechaBetween(
        @Param("inicio") LocalDate inicio, 
        @Param("fin") LocalDate fin
    );

    Optional<CajaIngreso> findByPago(Pago pago);
}
