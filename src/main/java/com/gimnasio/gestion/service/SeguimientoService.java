package com.gimnasio.gestion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import com.gimnasio.gestion.model.Seguimiento;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.SeguimientoRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;

@Service
@Transactional
public class SeguimientoService {
    @Autowired
    private SeguimientoRepository seguimientoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    public Seguimiento guardar(Seguimiento seguimiento) {
        return seguimientoRepository.save(seguimiento);
    }

    public List<Seguimiento> obtenerHistorialCliente(Long clienteId) {
        Usuario cliente = usuarioRepository.findById(clienteId)
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return seguimientoRepository.findByClienteOrderByFechaDesc(cliente);
    }
}