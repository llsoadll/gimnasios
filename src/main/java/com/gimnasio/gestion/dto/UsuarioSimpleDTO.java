package com.gimnasio.gestion.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioSimpleDTO {
    private Long id;
    private String nombre;
    private String apellido;
}