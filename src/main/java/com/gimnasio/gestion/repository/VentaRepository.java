package com.gimnasio.gestion.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.model.Venta;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findAllByOrderByFechaDesc();
    List<Venta> findByCliente(Usuario cliente);
    List<Venta> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
}