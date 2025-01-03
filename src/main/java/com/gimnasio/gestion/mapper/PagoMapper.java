package com.gimnasio.gestion.mapper;

import org.springframework.stereotype.Component;
import com.gimnasio.gestion.dto.PagoDTO;
import com.gimnasio.gestion.model.Pago;

@Component
public class PagoMapper {
    
    public PagoDTO toDTO(Pago pago) {
        if (pago == null) return null;
        
        PagoDTO dto = new PagoDTO();
        dto.setId(pago.getId());
        dto.setFecha(pago.getFecha());
        dto.setMonto(pago.getMonto());
        dto.setMetodoPago(pago.getMetodoPago());
        dto.setMembresiaId(pago.getMembresia().getId());
        dto.setClienteNombre(pago.getMembresia().getCliente().getNombre());
        dto.setClienteApellido(pago.getMembresia().getCliente().getApellido());
        return dto;
    }
    
    public Pago toEntity(PagoDTO dto) {
        if (dto == null) return null;
        
        Pago pago = new Pago();
        pago.setId(dto.getId());
        pago.setFecha(dto.getFecha());
        pago.setMonto(dto.getMonto());
        pago.setMetodoPago(dto.getMetodoPago());
        return pago;
    }
}