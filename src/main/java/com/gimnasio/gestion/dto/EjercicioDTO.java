package com.gimnasio.gestion.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EjercicioDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Integer series;
    private Integer repeticiones;
    private String imagenUrl;
    private String videoUrl;
}