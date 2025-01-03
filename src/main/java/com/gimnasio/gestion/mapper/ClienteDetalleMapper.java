package com.gimnasio.gestion.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.gimnasio.gestion.dto.ClienteDetalleDTO;
import com.gimnasio.gestion.model.Usuario;

@Component
public class ClienteDetalleMapper {
    
    @Autowired
    private MembresiaMapper membresiaMapper;
    
    @Autowired
    private RutinaMapper rutinaMapper;
    
    @Autowired
    private PagoMapper pagoMapper;

    public ClienteDetalleDTO toDTO(Usuario usuario) {
        if (usuario == null) return null;
        
        ClienteDetalleDTO dto = new ClienteDetalleDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setEmail(usuario.getEmail());
        dto.setFechaNacimiento(usuario.getFechaNacimiento());
        dto.setTelefono(usuario.getTelefono());
        dto.setActivo(usuario.isActivo());
        
        // Mapear membresias
        dto.setMembresias(usuario.getMembresias().stream()
            .map(membresiaMapper::toDTO)
            .toList());
            
        // Mapear rutinas
        dto.setRutinas(usuario.getRutinas().stream()
            .map(rutinaMapper::toDTO)
            .toList());
            
        // Mapear pagos
        dto.setPagos(usuario.getMembresias().stream()
            .flatMap(membresia -> membresia.getPagos().stream())
            .map(pagoMapper::toDTO)
            .toList());
            
        return dto;
    }
}