package com.gimnasio.gestion.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.persistence.EnumType;
import jakarta.persistence.Column;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.gimnasio.gestion.enums.TipoUsuario;

@Entity
@Table(name = "usuarios")
@Data
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, length = 50)
    private String nombre;
    
    @NotBlank(message = "El apellido es obligatorio")
    @Column(nullable = false, length = 50)
    private String apellido;
    
    @Email(message = "El email debe ser válido")
    @NotBlank(message = "El email es obligatorio")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    @Column(nullable = false)
    private String password;
    
    private LocalDate fechaNacimiento;
    
    @Size(max = 15)
    private String telefono;
    
    @Column(nullable = false)
    private boolean activo = true;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoUsuario tipo;
    
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"cliente", "pagos"})
    private List<Membresia> membresias = new ArrayList<>();
    
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"cliente", "entrenador"})
    private List<Rutina> rutinas = new ArrayList<>();
    
    @OneToMany(mappedBy = "entrenador", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"cliente", "entrenador"})
    private List<Rutina> rutinasComoEntrenador = new ArrayList<>();
}