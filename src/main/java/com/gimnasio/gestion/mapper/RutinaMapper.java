package com.gimnasio.gestion.mapper;

import org.springframework.stereotype.Component;
import com.gimnasio.gestion.dto.RutinaDTO;
import com.gimnasio.gestion.dto.UsuarioDTO;
import com.gimnasio.gestion.model.Rutina;
import com.gimnasio.gestion.model.Usuario;

@Component
public class RutinaMapper {
    
    public RutinaDTO toDTO(Rutina rutina) {
        if (rutina == null) return null;
        
        RutinaDTO dto = new RutinaDTO();
        dto.setId(rutina.getId());
        dto.setNombre(rutina.getNombre());
        dto.setDescripcion(rutina.getDescripcion());
        
        if (rutina.getCliente() != null) {
            UsuarioDTO clienteDTO = new UsuarioDTO();
            clienteDTO.setId(rutina.getCliente().getId());
            clienteDTO.setNombre(rutina.getCliente().getNombre());
            clienteDTO.setApellido(rutina.getCliente().getApellido());
            clienteDTO.setEmail(rutina.getCliente().getEmail());
            clienteDTO.setTipo(rutina.getCliente().getTipo());
            clienteDTO.setActivo(rutina.getCliente().isActivo());
            dto.setCliente(clienteDTO);
        }
        
        if (rutina.getEntrenador() != null) {
            UsuarioDTO entrenadorDTO = new UsuarioDTO();
            entrenadorDTO.setId(rutina.getEntrenador().getId());
            entrenadorDTO.setNombre(rutina.getEntrenador().getNombre());
            entrenadorDTO.setApellido(rutina.getEntrenador().getApellido());
            entrenadorDTO.setEmail(rutina.getEntrenador().getEmail());
            entrenadorDTO.setTipo(rutina.getEntrenador().getTipo());
            entrenadorDTO.setActivo(rutina.getEntrenador().isActivo());
            dto.setEntrenador(entrenadorDTO);
        }
        
        return dto;
    }

    public Rutina toEntity(RutinaDTO dto) {
        if (dto == null) return null;
        
        Rutina rutina = new Rutina();
        rutina.setId(dto.getId());
        rutina.setNombre(dto.getNombre());
        rutina.setDescripcion(dto.getDescripcion());
        
        if (dto.getCliente() != null) {
            Usuario cliente = new Usuario();
            cliente.setId(dto.getCliente().getId());
            rutina.setCliente(cliente);
        }
        
        if (dto.getEntrenador() != null) {
            Usuario entrenador = new Usuario();
            entrenador.setId(dto.getEntrenador().getId());
            rutina.setEntrenador(entrenador);
        }
        
        return rutina;
    }
}