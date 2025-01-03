package com.gimnasio.gestion.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class PagoDTO {
    private Long id;
    private LocalDate fecha;
    private Double monto;
    private String metodoPago;
    private Long membresiaId;
    private String clienteNombre;
    private String clienteApellido;
}