package com.gimnasio.gestion.service;

import lombok.extern.slf4j.Slf4j;
import com.gimnasio.gestion.dto.RutinaDTO;
import com.gimnasio.gestion.dto.RutinaTemplateDTO;
import com.gimnasio.gestion.dto.UsuarioSimpleDTO;
import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.mapper.RutinaMapper;
import com.gimnasio.gestion.model.Rutina;
import com.gimnasio.gestion.model.RutinaTemplate;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.RutinaRepository;
import com.gimnasio.gestion.repository.RutinaTemplateRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class RutinaService {
    @Autowired
    private RutinaRepository rutinaRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private RutinaMapper rutinaMapper;

    @Autowired
    private RutinaTemplateRepository rutinaTemplateRepository; 


    public RutinaDTO crearRutina(RutinaDTO rutinaDTO) {
        Rutina rutina = rutinaMapper.toEntity(rutinaDTO);
        
        if (rutinaDTO.getEntrenador() != null && rutinaDTO.getEntrenador().getId() != null) {
            Usuario entrenador = usuarioRepository.findById(rutinaDTO.getEntrenador().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Entrenador no encontrado"));
            rutina.setEntrenador(entrenador);
        }
        
        rutina.setCliente(null); // Importante: siempre null al crear
        
        Rutina rutinaGuardada = rutinaRepository.save(rutina);
        return rutinaMapper.toDTO(rutinaGuardada);
    }

    public RutinaTemplateDTO crearTemplate(RutinaTemplateDTO dto) {
        try {
            log.info("Iniciando creación de template con datos: {}", dto);
            
            RutinaTemplate template = new RutinaTemplate();
            template.setNombre(dto.getNombre());
            template.setDescripcion(dto.getDescripcion());
            template.setNivel(dto.getNivel());
            template.setCategoria(dto.getCategoria());
            template.setDuracionMinutos(dto.getDuracionMinutos());
            template.setImagenUrl(dto.getImagenUrl());
            
            if (dto.getEntrenadorId() != null) {
                log.info("Buscando entrenador con ID: {}", dto.getEntrenadorId());
                Usuario entrenador = usuarioRepository.findById(dto.getEntrenadorId())
                    .orElseThrow(() -> {
                        log.error("Entrenador no encontrado con ID: {}", dto.getEntrenadorId());
                        return new ResourceNotFoundException("Entrenador no encontrado");
                    });
                template.setEntrenador(entrenador);
            }
            
            log.info("Guardando template en base de datos");
            RutinaTemplate templateGuardado = rutinaTemplateRepository.save(template);
            log.info("Template guardado exitosamente con ID: {}", templateGuardado.getId());
            
            return convertirATemplateDTO(templateGuardado);
        } catch (Exception e) {
            log.error("Error al crear template: ", e);
            throw e;
        }
    }

    public List<RutinaDTO> obtenerTodas() {
    return rutinaRepository.findAll().stream()
            .map(rutina -> {
                RutinaDTO dto = rutinaMapper.toDTO(rutina);
                if (rutina.getCliente() != null) {
                    dto.setCliente(new UsuarioSimpleDTO(
                        rutina.getCliente().getId(),
                        rutina.getCliente().getNombre(),
                        rutina.getCliente().getApellido()
                    ));
                }
                return dto;
            })
            .collect(Collectors.toList());
}

    @Transactional
    public void eliminarTemplate(Long id) {
        if (!rutinaTemplateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Template no encontrado");
        }
        rutinaTemplateRepository.deleteById(id);
    }

    public List<RutinaDTO> obtenerRutinasCliente(Long clienteId) {
        Usuario cliente = usuarioRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
        
        return rutinaRepository.findByCliente(cliente).stream()
                .map(rutinaMapper::toDTO)
                .collect(Collectors.toList());
    }

    public RutinaDTO actualizarRutina(RutinaDTO rutinaDTO) {
        Rutina rutina = rutinaRepository.findById(rutinaDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Rutina no encontrada"));
        
        rutina.setNombre(rutinaDTO.getNombre());
        rutina.setDescripcion(rutinaDTO.getDescripcion());
        rutina.setNivel(rutinaDTO.getNivel());
        rutina.setCategoria(rutinaDTO.getCategoria());
        rutina.setDuracionMinutos(rutinaDTO.getDuracionMinutos());
        rutina.setImagenUrl(rutinaDTO.getImagenUrl());
        
        if (rutinaDTO.getEntrenadorId() != null) {
            Usuario entrenador = usuarioRepository.findById(rutinaDTO.getEntrenadorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Entrenador no encontrado"));
            rutina.setEntrenador(entrenador);
        }
        
        Rutina rutinaActualizada = rutinaRepository.save(rutina);
        return rutinaMapper.toDTO(rutinaActualizada);
    }

    public void eliminarRutina(Long id) {
        if (!rutinaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Rutina no encontrada");
        }
        rutinaRepository.deleteById(id);
    }

    public RutinaDTO asignarRutina(Long templateId, Long clienteId) {
        RutinaTemplate template = rutinaTemplateRepository.findById(templateId)
            .orElseThrow(() -> new ResourceNotFoundException("Template no encontrada"));
            
        Usuario cliente = usuarioRepository.findById(clienteId)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
            
        Rutina rutina = new Rutina();
        rutina.setNombre(template.getNombre());
        rutina.setDescripcion(template.getDescripcion());
        rutina.setNivel(template.getNivel());
        rutina.setCategoria(template.getCategoria());
        rutina.setDuracionMinutos(template.getDuracionMinutos());
        rutina.setImagenUrl(template.getImagenUrl());
        rutina.setCliente(cliente);
        rutina.setEntrenador(template.getEntrenador());
        rutina.setEjercicios(new ArrayList<>()); // Copiar ejercicios si es necesario
        
        Rutina rutinaGuardada = rutinaRepository.save(rutina);
        return rutinaMapper.toDTO(rutinaGuardada);
    }

    public List<RutinaTemplateDTO> obtenerTemplates() {
        List<RutinaTemplate> templates = rutinaTemplateRepository.findAll();
        return templates.stream()
            .map(this::convertirATemplateDTO)
            .collect(Collectors.toList());
    }

    private RutinaTemplateDTO convertirATemplateDTO(RutinaTemplate template) {
        RutinaTemplateDTO dto = new RutinaTemplateDTO();
        dto.setId(template.getId());
        dto.setNombre(template.getNombre());
        dto.setDescripcion(template.getDescripcion());
        dto.setNivel(template.getNivel());
        dto.setCategoria(template.getCategoria());
        dto.setDuracionMinutos(template.getDuracionMinutos());
        dto.setImagenUrl(template.getImagenUrl());
        
        if (template.getEntrenador() != null) {
            dto.setEntrenadorId(template.getEntrenador().getId());
        }
        
        return dto;
    }
}