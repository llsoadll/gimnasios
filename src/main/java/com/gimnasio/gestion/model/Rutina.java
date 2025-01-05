package com.gimnasio.gestion.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "rutinas")
@Data
public class Rutina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 255)
    private String nombre;

    @Column(columnDefinition = "TEXT")  // Para permitir textos largos
    private String descripcion;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "entrenador_id")
    @JsonIgnoreProperties({"rutinas", "rutinasComoEntrenador", "membresias", "password"})
    private Usuario entrenador;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id")
    @JsonIgnoreProperties({"rutinas", "rutinasComoEntrenador", "membresias", "password"})
    private Usuario cliente;
}