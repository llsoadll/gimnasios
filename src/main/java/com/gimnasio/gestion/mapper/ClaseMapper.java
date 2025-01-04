package com.gimnasio.gestion.mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import com.gimnasio.gestion.dto.ClaseDTO;
import com.gimnasio.gestion.dto.UsuarioDTO;
import com.gimnasio.gestion.model.Clase;

@Component
public class ClaseMapper {
    
    public ClaseDTO toDTO(Clase clase) {
        ClaseDTO dto = new ClaseDTO();
        
        
        dto.setId(clase.getId());
        dto.setNombre(clase.getNombre());
        dto.setDescripcion(clase.getDescripcion());
        dto.setDia(clase.getDia());
        dto.setHorario(clase.getHorario());
        dto.setCupo(clase.getCupo());
        
        if (clase.getEntrenador() != null) {
            UsuarioDTO entrenadorDTO = new UsuarioDTO();
            entrenadorDTO.setId(clase.getEntrenador().getId());
            entrenadorDTO.setNombre(clase.getEntrenador().getNombre());
            entrenadorDTO.setApellido(clase.getEntrenador().getApellido());
            dto.setEntrenador(entrenadorDTO);
        }

         // Agregar cupos disponibles
        long clientesActivos = clase.getClientesInscritos().size();
        dto.setCuposDisponibles(clase.getCupo() - (int)clientesActivos);
        
        // Mapear clientes inscritos
        dto.setClientesInscritos(clase.getClientesInscritos().stream()
            .map(cliente -> {
                UsuarioDTO userDto = new UsuarioDTO();
                userDto.setId(cliente.getId());
                userDto.setNombre(cliente.getNombre());
                userDto.setApellido(cliente.getApellido());
                return userDto;
            })
            .collect(Collectors.toList()));
        
        return dto;
    }
}