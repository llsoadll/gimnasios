package com.gimnasio.gestion.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.model.Clase;

@Repository
public interface ClaseRepository extends JpaRepository<Clase, Long> {
    List<Clase> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
}
