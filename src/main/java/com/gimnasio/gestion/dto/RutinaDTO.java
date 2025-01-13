package com.gimnasio.gestion.dto;

import java.util.List;
import java.util.ArrayList;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.gimnasio.gestion.enums.NivelDificultad;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RutinaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private NivelDificultad nivel = NivelDificultad.PRINCIPIANTE;
    private String categoria = "FUERZA";
    private Long entrenadorId;
    private UsuarioSimpleDTO cliente;
    private UsuarioSimpleDTO entrenador;
    private Integer duracionMinutos;
    private String imagenUrl;
    private List<EjercicioDTO> ejercicios = new ArrayList<>();
}