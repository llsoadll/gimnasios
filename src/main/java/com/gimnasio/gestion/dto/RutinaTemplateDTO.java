package com.gimnasio.gestion.dto;

import java.util.List;

import com.gimnasio.gestion.enums.NivelDificultad;

import lombok.Data;
@Data
public class RutinaTemplateDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private NivelDificultad nivel;
    private String categoria;
    private Integer duracionMinutos;
    private String imagenUrl;
    private Long entrenadorId;
    private List<EjercicioDTO> ejercicios;
}