package com.gimnasio.gestion.mapper;

import org.springframework.stereotype.Component;
import com.gimnasio.gestion.dto.RutinaDTO;
import com.gimnasio.gestion.dto.UsuarioSimpleDTO;
import com.gimnasio.gestion.model.Rutina;

@Component
public class RutinaMapper {
    
    public RutinaDTO toDTO(Rutina entity) {
        if (entity == null) return null;
        
        RutinaDTO dto = new RutinaDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setNivel(entity.getNivel());
        dto.setCategoria(entity.getCategoria());
        dto.setDuracionMinutos(entity.getDuracionMinutos());
        dto.setImagenUrl(entity.getImagenUrl());
        
        // Manejar entrenador
        if (entity.getEntrenador() != null) {
            UsuarioSimpleDTO entrenadorDto = new UsuarioSimpleDTO();
            entrenadorDto.setId(entity.getEntrenador().getId());
            entrenadorDto.setNombre(entity.getEntrenador().getNombre());
            entrenadorDto.setApellido(entity.getEntrenador().getApellido());
            dto.setEntrenador(entrenadorDto);
            dto.setEntrenadorId(entity.getEntrenador().getId());
        }
        
        return dto;
    }
    
    public Rutina toEntity(RutinaDTO dto) {
        if (dto == null) return null;
        
        Rutina rutina = new Rutina();
        rutina.setId(dto.getId());
        rutina.setNombre(dto.getNombre());
        rutina.setDescripcion(dto.getDescripcion());
        rutina.setNivel(dto.getNivel());
        rutina.setCategoria(dto.getCategoria());
        rutina.setDuracionMinutos(dto.getDuracionMinutos());
        rutina.setImagenUrl(dto.getImagenUrl());
        
        // No mapeamos el cliente aquí, se maneja en el servicio
        rutina.setCliente(null);
        
        return rutina;
    }
}