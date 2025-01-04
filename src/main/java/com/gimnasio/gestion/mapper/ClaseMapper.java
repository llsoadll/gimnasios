package com.gimnasio.gestion.mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import com.gimnasio.gestion.dto.ClaseDTO;
import com.gimnasio.gestion.dto.ClienteInscritoDTO;
import com.gimnasio.gestion.dto.UsuarioDTO;
import com.gimnasio.gestion.model.Clase;
import com.gimnasio.gestion.model.InscripcionClase;
import com.gimnasio.gestion.model.Usuario;

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
         dto.setClientesInscritos(clase.getInscripciones().stream()
            .filter(InscripcionClase::isActiva)
            .map(inscripcion -> {
                ClienteInscritoDTO clienteDTO = new ClienteInscritoDTO();
                Usuario cliente = inscripcion.getCliente();
                clienteDTO.setId(cliente.getId());
                clienteDTO.setNombre(cliente.getNombre());
                clienteDTO.setApellido(cliente.getApellido());
                clienteDTO.setInscripcionId(inscripcion.getId());
                return clienteDTO;
            })
            .collect(Collectors.toList()));
        
        return dto;
    }
}