package com.gimnasio.gestion.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

import com.gimnasio.gestion.enums.TipoMembresia;

@Entity
@Table(name = "membresias")
@Data
public class Membresia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)  // Cambiar a EAGER
    @JoinColumn(name = "cliente_id", nullable = false)  // Agregar columna
    private Usuario cliente;
    
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Double precio;
    private boolean activa;
    
    @Enumerated(EnumType.STRING)
    private TipoMembresia tipo;
    
    @OneToMany(mappedBy = "membresia")
    private List<Pago> pagos;

}