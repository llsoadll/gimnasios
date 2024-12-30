package com.gimnasio.gestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.model.Membresia;
import com.gimnasio.gestion.model.Usuario;
import java.util.List;

@Repository
public interface MembresiaRepository extends JpaRepository<Membresia, Long> {
    List<Membresia> findByCliente(Usuario cliente);
    List<Membresia> findByClienteAndActiva(Usuario cliente, boolean activa);
}