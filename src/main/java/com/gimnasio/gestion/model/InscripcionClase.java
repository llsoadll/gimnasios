package com.gimnasio.gestion.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscripciones_clases")
@Data
public class InscripcionClase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "clase_id")
    private Clase clase;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Usuario cliente;
    
    private LocalDateTime fechaInscripcion = LocalDateTime.now();
    private boolean activa = true;
}