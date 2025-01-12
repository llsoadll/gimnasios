package com.gimnasio.gestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.model.RutinaTemplate;
import com.gimnasio.gestion.model.Usuario;
import java.util.List;

@Repository
public interface RutinaTemplateRepository extends JpaRepository<RutinaTemplate, Long> {
    List<RutinaTemplate> findByEntrenador(Usuario entrenador);
}