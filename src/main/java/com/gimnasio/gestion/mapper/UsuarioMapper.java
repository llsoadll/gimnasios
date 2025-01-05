package com.gimnasio.gestion.mapper;

import org.springframework.stereotype.Component;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.dto.UsuarioDTO;

@Component
public class UsuarioMapper {
    
    public UsuarioDTO toDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setEmail(usuario.getEmail());
        dto.setTelefono(usuario.getTelefono());
        dto.setFechaNacimiento(usuario.getFechaNacimiento());
        dto.setActivo(usuario.isActivo());
        dto.setTipo(usuario.getTipo());
        return dto;
    }
}