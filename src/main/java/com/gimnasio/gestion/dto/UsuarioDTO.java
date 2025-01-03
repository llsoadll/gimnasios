package com.gimnasio.gestion.dto;

import com.gimnasio.gestion.enums.TipoUsuario;
import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private TipoUsuario tipo;
    private boolean activo;
}