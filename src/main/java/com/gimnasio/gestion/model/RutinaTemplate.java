package com.gimnasio.gestion.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Table; // Cambiar este import

import com.gimnasio.gestion.enums.NivelDificultad;
import lombok.Data;

@Entity
@Table(name = "rutina_templates") // Ahora usa la anotación correcta de JPA
@Data
public class RutinaTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Enumerated(EnumType.STRING)
    private NivelDificultad nivel;
    
    private String categoria;
    private Integer duracionMinutos;
    
    @Column(columnDefinition = "TEXT")
    private String imagenUrl;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "entrenador_id")
    private Usuario entrenador;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "rutina_template_id")
    private List<Ejercicio> ejercicios = new ArrayList<>();
}