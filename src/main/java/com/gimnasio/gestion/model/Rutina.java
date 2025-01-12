package com.gimnasio.gestion.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import com.gimnasio.gestion.enums.NivelDificultad;

@Entity
@Table(name = "rutinas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rutina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 255, nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String imagenUrl;
    
    @OneToMany(mappedBy = "rutina", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("rutina")
    private List<Ejercicio> ejercicios;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NivelDificultad nivel = NivelDificultad.PRINCIPIANTE; // Valor por defecto
    
    @Column
    private String categoria;
    
    @Column
    private Integer duracionMinutos;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "entrenador_id")
    @JsonIgnoreProperties({"rutinas", "rutinasComoEntrenador", "membresias", "password"})
    private Usuario entrenador;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id")
    @JsonIgnoreProperties({"rutinas", "rutinasComoEntrenador", "membresias", "password"})
    private Usuario cliente;
}