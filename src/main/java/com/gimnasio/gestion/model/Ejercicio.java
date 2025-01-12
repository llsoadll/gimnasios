package com.gimnasio.gestion.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "ejercicios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ejercicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column
    private String imagenUrl;
    
    @Column
    private Integer series;
    
    @Column
    private Integer repeticiones;
    
    @Column
    private String videoUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rutina_id")
    @JsonIgnoreProperties("ejercicios")
    private Rutina rutina;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rutina_template_id")
    @JsonIgnoreProperties("ejercicios")
    private RutinaTemplate rutinaTemplate;
}