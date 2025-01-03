package com.gimnasio.gestion.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class SeguimientoDTO {
    private Long id;
    private LocalDate fecha;
    private Double peso;
    private Double altura;
    private Double imc;
    private String observaciones;
    private Long clienteId;
}