package com.gimnasio.gestion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

import com.gimnasio.gestion.dto.PagoDTO;
import com.gimnasio.gestion.model.Pago;
import com.gimnasio.gestion.model.Membresia;
import com.gimnasio.gestion.repository.PagoRepository;
import com.gimnasio.gestion.repository.MembresiaRepository;
import com.gimnasio.gestion.mapper.PagoMapper;
import com.gimnasio.gestion.exception.ResourceNotFoundException;

@Service
@Transactional
public class PagoService {
    @Autowired
    private PagoRepository pagoRepository;
    
    @Autowired
    private MembresiaRepository membresiaRepository;
    
    @Autowired
    private PagoMapper pagoMapper;
    
    public PagoDTO registrarPago(PagoDTO pagoDTO) {
        Pago pago = pagoMapper.toEntity(pagoDTO);
        
        Membresia membresia = membresiaRepository.findById(pagoDTO.getMembresiaId())
            .orElseThrow(() -> new ResourceNotFoundException("Membresía no encontrada"));
            
        pago.setMembresia(membresia);
        
        Pago pagoGuardado = pagoRepository.save(pago);
        return pagoMapper.toDTO(pagoGuardado);
    }
    
    public List<PagoDTO> obtenerTodos() {
        return pagoRepository.findAll().stream()
            .map(pagoMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    public List<PagoDTO> obtenerPagosPorMembresia(Long membresiaId) {
        Membresia membresia = membresiaRepository.findById(membresiaId)
            .orElseThrow(() -> new ResourceNotFoundException("Membresía no encontrada"));
            
        return pagoRepository.findByMembresia(membresia).stream()
            .map(pagoMapper::toDTO)
            .collect(Collectors.toList());
    }
}