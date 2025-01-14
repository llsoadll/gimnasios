package com.gimnasio.gestion.dto;

import lombok.Data;

@Data
public class ClienteVentaDTO {
    private Long id;
    private String nombre;
    private String apellido;

    public ClienteVentaDTO() {}

    public ClienteVentaDTO(Long id, String nombre, String apellido) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
    }
}