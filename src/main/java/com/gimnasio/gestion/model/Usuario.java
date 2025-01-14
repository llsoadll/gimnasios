package com.gimnasio.gestion.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
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
    private String email; // Será el username
    
    
    private String username; // Podría ser el email

    private String rol; // ROLE_CLIENTE, ROLE_ENTRENADOR, ROLE_ADMIN

    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    @Column(nullable = true)
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

    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"cliente"})
    private List<Venta> ventas = new ArrayList<>();
    
    @OneToMany(mappedBy = "entrenador", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"cliente", "entrenador"})
    private List<Rutina> rutinasComoEntrenador = new ArrayList<>();

    @PrePersist
public void prePersist() {
    if (this.tipo == null) {
        this.tipo = TipoUsuario.CLIENTE;
    }

    // Generate default password if not set
    if (this.password == null || this.password.isEmpty()) {
        if (this.tipo == TipoUsuario.ADMIN) {
            this.password = "admin123";
        } else {
            this.password = generateDefaultPassword();
        }
        // Agregar log para debug
        System.out.println("Contraseña generada para " + this.email + ": " + this.password);
    }

    this.activo = true;
}

private String generateDefaultPassword() {
    if (this.email == null || this.telefono == null) {
        throw new IllegalStateException("Email y teléfono son requeridos para generar la contraseña");
    }

    // Obtener las primeras 3 letras del email
    String emailPrefix = this.email.substring(0, Math.min(3, this.email.length()));
    
    // Obtener los últimos 4 dígitos del teléfono
    String phonePrefix = this.telefono.substring(Math.max(0, this.telefono.length() - 4));
    
    String password = emailPrefix + phonePrefix;
    System.out.println("Password generada para " + this.email + ": " + password);
    return password;
}
}