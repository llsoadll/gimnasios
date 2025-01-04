package com.gimnasio.gestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.model.InscripcionClase;
import com.gimnasio.gestion.model.Clase;
import com.gimnasio.gestion.model.Usuario;
import java.util.List;

@Repository
public interface InscripcionClaseRepository extends JpaRepository<InscripcionClase, Long> {
    List<InscripcionClase> findByClaseAndActivaTrue(Clase clase);
    List<InscripcionClase> findByClienteAndActivaTrue(Usuario cliente);
    boolean existsByClaseAndClienteAndActivaTrue(Clase clase, Usuario cliente);
}