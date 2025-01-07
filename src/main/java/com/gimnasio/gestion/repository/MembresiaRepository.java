package com.gimnasio.gestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.model.Membresia;
import com.gimnasio.gestion.model.Usuario;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MembresiaRepository extends JpaRepository<Membresia, Long> {
    List<Membresia> findByCliente(Usuario cliente);
    List<Membresia> findByClienteAndActiva(Usuario cliente, boolean activa);
        List<Membresia> findByActivaTrueAndFechaFinBefore(LocalDate fecha);
        List<Membresia> findByActivaTrue();
        @Query("SELECT m FROM Membresia m WHERE m.activa = true AND NOT EXISTS (SELECT p FROM Pago p WHERE p.membresia = m)")
    List<Membresia> findMembresiasSinPagar();

}