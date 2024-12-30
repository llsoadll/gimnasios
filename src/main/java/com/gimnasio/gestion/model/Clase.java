package com.gimnasio.gestion.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "clases")
@Data
public class Clase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private LocalDateTime fechaHora;
    private Integer capacidadMaxima;
    
    @ManyToOne
    private Usuario instructor;
    
    @ManyToMany
    private List<Usuario> participantes;
}

