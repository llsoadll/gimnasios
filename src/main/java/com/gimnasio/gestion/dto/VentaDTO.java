package com.gimnasio.gestion.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class VentaDTO {
    private Long id;
    private LocalDateTime fecha;
    private Integer cantidad;
    private Double precioUnitario; 
    private Double total;
    private String metodoPago;
    private ClienteVentaDTO cliente;
    private ProductoVentaDTO producto;

    public VentaDTO() {}

    // Este constructor debe coincidir exactamente con el orden y tipos en la consulta JPQL
    public VentaDTO(Long id, LocalDateTime fecha, Integer cantidad, 
                    Double precioUnitario, Double total, String metodoPago, 
                    ClienteVentaDTO cliente, ProductoVentaDTO producto) {
        this.id = id;
        this.fecha = fecha;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.total = total;
        this.metodoPago = metodoPago;
        this.cliente = cliente;
        this.producto = producto;
    }
}