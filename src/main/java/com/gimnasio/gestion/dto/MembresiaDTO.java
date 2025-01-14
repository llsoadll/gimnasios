package com.gimnasio.gestion.dto;

import java.time.LocalDate;
import java.util.List;

import com.gimnasio.gestion.enums.TipoMembresia;
import lombok.Data;

@Data
public class MembresiaDTO {
    private Long id;
    private UsuarioSimpleDTO cliente;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Double precio;
    private boolean activa;
    private TipoMembresia tipo;
    private List<PagoDTO> pagos;
    private Long clienteId;  
}