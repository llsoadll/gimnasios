package com.gimnasio.gestion.dto;

import lombok.Data;

@Data
public class ProductoVentaDTO {
    private Long id;
    private String nombre;

    public ProductoVentaDTO() {}

    public ProductoVentaDTO(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}