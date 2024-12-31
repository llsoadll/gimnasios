package com.gimnasio.gestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.model.Clase;

@Repository
public interface ClaseRepository extends JpaRepository<Clase, Long> {
}
