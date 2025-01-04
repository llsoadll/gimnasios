package com.gimnasio.gestion.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
    private String descripcion;
    private String dia;
    private String horario;
    private Integer cupo;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "entrenador_id")
    @JsonIgnoreProperties({"rutinas", "rutinasComoEntrenador", "membresias", "password"})
    private Usuario entrenador;
    
    @OneToMany(mappedBy = "clase")
    @JsonIgnoreProperties("clase")
    private List<InscripcionClase> inscripciones = new ArrayList<>();
    
    @JsonIgnore
    public List<Usuario> getClientesInscritos() {
        return inscripciones.stream()
            .filter(InscripcionClase::isActiva)
            .map(InscripcionClase::getCliente)
            .collect(Collectors.toList());
    }
    
    public boolean tieneEspacioDisponible() {
        long clientesActivos = inscripciones.stream()
            .filter(InscripcionClase::isActiva)
            .count();
        return clientesActivos < cupo;
    }
}