package com.gimnasio.gestion.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "inscripciones_clases")
@Data
public class InscripcionClase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clase_id", nullable = false)
    private Clase clase;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;
    
    private LocalDateTime fechaInscripcion = LocalDateTime.now();
    private boolean activa = true;


    // Evitar recursión infinita en JSON
    @JsonIgnore
    public Clase getClase() {
        return clase;
    }
    
    @JsonIgnore
    public Usuario getCliente() {
        return cliente;
    }
}