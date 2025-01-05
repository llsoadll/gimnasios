package com.gimnasio.gestion.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.enums.TipoUsuario;
import com.gimnasio.gestion.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	Optional<Usuario> findByEmail(String email);
	 List<Usuario> findByActivoTrueAndTipo(TipoUsuario tipo);
}
