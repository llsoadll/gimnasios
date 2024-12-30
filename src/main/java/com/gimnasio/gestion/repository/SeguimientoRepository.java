package com.gimnasio.gestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.model.Seguimiento;
import com.gimnasio.gestion.model.Usuario;
import java.util.List;

@Repository
public interface SeguimientoRepository extends JpaRepository<Seguimiento, Long> {
    List<Seguimiento> findByClienteOrderByFechaDesc(Usuario cliente);
}