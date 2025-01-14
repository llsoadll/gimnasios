package com.gimnasio.gestion.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.gimnasio.gestion.model.Venta;
import com.gimnasio.gestion.dto.VentaDTO;
import com.gimnasio.gestion.dto.ClienteVentaDTO;
import com.gimnasio.gestion.dto.ProductoVentaDTO;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    @Query("SELECT NEW com.gimnasio.gestion.dto.VentaDTO(" +
           "v.id, v.fecha, v.cantidad, v.precioUnitario, v.total, v.metodoPago, " +
           "NEW com.gimnasio.gestion.dto.ClienteVentaDTO(c.id, c.nombre, c.apellido), " +
           "NEW com.gimnasio.gestion.dto.ProductoVentaDTO(p.id, p.nombre)) " +
           "FROM Venta v " +
           "JOIN v.cliente c " +
           "JOIN v.producto p " +
           "ORDER BY v.fecha DESC")
    List<VentaDTO> findAllVentasDTO();  // Cambiamos el nombre del método
}
