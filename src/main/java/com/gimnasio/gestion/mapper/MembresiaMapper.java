package com.gimnasio.gestion.mapper;

import org.springframework.stereotype.Component;
import com.gimnasio.gestion.dto.MembresiaDTO;
import com.gimnasio.gestion.dto.UsuarioSimpleDTO;
import com.gimnasio.gestion.model.Membresia;
import com.gimnasio.gestion.model.Usuario;

@Component
public class MembresiaMapper {

    public MembresiaDTO toDTO(Membresia membresia) {
        if (membresia == null) return null;
        
        MembresiaDTO dto = new MembresiaDTO();
        dto.setId(membresia.getId());
        dto.setFechaInicio(membresia.getFechaInicio());
        dto.setFechaFin(membresia.getFechaFin());
        dto.setPrecio(membresia.getPrecio());
        dto.setActiva(membresia.isActiva());
        dto.setTipo(membresia.getTipo());
        
        if (membresia.getCliente() != null) {
            UsuarioSimpleDTO clienteDTO = new UsuarioSimpleDTO();
            clienteDTO.setId(membresia.getCliente().getId());
            clienteDTO.setNombre(membresia.getCliente().getNombre());
            clienteDTO.setApellido(membresia.getCliente().getApellido());
            dto.setCliente(clienteDTO);
        }
        
        return dto;
    }

    public Membresia toEntity(MembresiaDTO dto) {
        if (dto == null) return null;
        
        Membresia membresia = new Membresia();
        membresia.setId(dto.getId());
        membresia.setFechaInicio(dto.getFechaInicio());
        membresia.setFechaFin(dto.getFechaFin());
        membresia.setPrecio(dto.getPrecio());
        membresia.setActiva(dto.isActiva());
        membresia.setTipo(dto.getTipo());
        
        if (dto.getCliente() != null) {
            Usuario cliente = new Usuario();
            cliente.setId(dto.getCliente().getId());
            membresia.setCliente(cliente);
        }
        
        return membresia;
    }
}