package com.gimnasio.gestion.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.model.Rutina;
import com.gimnasio.gestion.model.Usuario;

@Repository
public interface RutinaRepository extends JpaRepository<Rutina, Long> {
    List<Rutina> findByCliente(Usuario cliente);
    List<Rutina> findByEntrenador(Usuario entrenador);
}

