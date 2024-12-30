package com.gimnasio.gestion.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "rutinas")
@Data
public class Rutina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String descripcion;
    
    @ManyToOne
    @JsonBackReference(value = "entrenador-rutinas")
    private Usuario entrenador;
    
    @ManyToOne
    @JsonBackReference(value = "cliente-rutinas")
    private Usuario cliente;

}
