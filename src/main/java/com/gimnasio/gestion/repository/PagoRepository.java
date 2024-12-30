package com.gimnasio.gestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gimnasio.gestion.model.Pago;
import com.gimnasio.gestion.model.Usuario;
import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    List<Pago> findByMembresiaCliente(Usuario cliente);
}