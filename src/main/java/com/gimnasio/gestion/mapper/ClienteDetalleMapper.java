package com.gimnasio.gestion.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.gimnasio.gestion.dto.ClienteDetalleDTO;
import com.gimnasio.gestion.dto.MembresiaDTO;
import com.gimnasio.gestion.dto.SeguimientoDTO;
import com.gimnasio.gestion.model.InscripcionClase;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.InscripcionClaseRepository;
import com.gimnasio.gestion.repository.SeguimientoRepository;

@Component
public class ClienteDetalleMapper {
    
    @Autowired
    private MembresiaMapper membresiaMapper;
    
    @Autowired
    private RutinaMapper rutinaMapper;
    
    @Autowired
    private PagoMapper pagoMapper;

    @Autowired
    private SeguimientoRepository seguimientoRepository;

    @Autowired
    private InscripcionClaseRepository inscripcionClaseRepository;
    
    @Autowired
    private ClaseMapper claseMapper;

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
        

        // Mapear membresias con sus pagos
        dto.setMembresias(usuario.getMembresias().stream()
            .map(membresia -> {
                MembresiaDTO membresiaDTO = membresiaMapper.toDTO(membresia);
                // Forzar la inicialización de los pagos
                membresia.getPagos().size();
                membresiaDTO.setPagos(membresia.getPagos().stream()
                    .map(pagoMapper::toDTO)
                    .collect(Collectors.toList()));
                return membresiaDTO;
            })
            .collect(Collectors.toList()));

            
        // Mapear rutinas
        dto.setRutinas(usuario.getRutinas().stream()
            .map(rutinaMapper::toDTO)
            .toList());
            
        // Mapear pagos
        dto.setPagos(usuario.getMembresias().stream()
            .flatMap(membresia -> membresia.getPagos().stream())
            .map(pagoMapper::toDTO)
            .toList());

        // Mapear seguimientos
        dto.setSeguimientos(seguimientoRepository.findByClienteOrderByFechaDesc(usuario).stream()
            .map(seguimiento -> {
                SeguimientoDTO segDTO = new SeguimientoDTO();
                segDTO.setId(seguimiento.getId());
                segDTO.setFecha(seguimiento.getFecha());
                segDTO.setPeso(seguimiento.getPeso());
                segDTO.setAltura(seguimiento.getAltura());
                segDTO.setImc(seguimiento.getImc());
                segDTO.setObservaciones(seguimiento.getObservaciones());
                segDTO.setClienteId(seguimiento.getCliente().getId());
                return segDTO;
            })
            .toList());

            // Mapear clases inscritas
        List<InscripcionClase> inscripcionesActivas = inscripcionClaseRepository
            .findByClienteAndActivaTrue(usuario);
            
        dto.setClasesInscritas(inscripcionesActivas.stream()
            .map(inscripcion -> claseMapper.toDTO(inscripcion.getClase()))
            .collect(Collectors.toList()));
            
        return dto;
    }
}