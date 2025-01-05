package com.gimnasio.gestion.dto;

import java.time.LocalDate;

import com.gimnasio.gestion.enums.TipoUsuario;
import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private LocalDate fechaNacimiento;
    private boolean activo;
    private TipoUsuario tipo;
}