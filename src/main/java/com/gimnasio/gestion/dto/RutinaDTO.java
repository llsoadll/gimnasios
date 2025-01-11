package com.gimnasio.gestion.dto;

import lombok.Data;

@Data
public class RutinaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private UsuarioDTO cliente;
    private UsuarioDTO entrenador;
    private Long clienteId;
    private Long entrenadorId;
    private String clienteNombre;
    private String entrenadorNombre;
}