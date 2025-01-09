package com.gimnasio.gestion.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "seguimientos")
@Data
public class Seguimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"seguimientos", "membresias", "rutinas"})
    private Usuario cliente;
    
    private LocalDate fecha;
    private Double peso;
    private Double altura;
    private Double imc;
    private String observaciones;
}
