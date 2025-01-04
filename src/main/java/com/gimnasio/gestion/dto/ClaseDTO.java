package com.gimnasio.gestion.dto;

import java.util.List;
import lombok.Data;

@Data
public class ClaseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String dia;
    private String horario;
    private Integer cupo;
    private UsuarioDTO entrenador;
    private Integer cuposDisponibles;
    private List<UsuarioDTO> clientesInscritos;
}