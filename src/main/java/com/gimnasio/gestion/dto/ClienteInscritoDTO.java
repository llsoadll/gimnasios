package com.gimnasio.gestion.dto;

import lombok.Data;

@Data
public class ClienteInscritoDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private Long inscripcionId;
}