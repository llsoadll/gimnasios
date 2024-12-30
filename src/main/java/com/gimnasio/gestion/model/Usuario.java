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
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.gimnasio.gestion.enums.TipoUsuario;  // Change this import


@Entity
@Table(name = "usuarios")
@Data
@JsonIdentityInfo(
  generator = ObjectIdGenerators.PropertyGenerator.class, 
  property = "id"
)
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
    private List<Membresia> membresias = new ArrayList<>();
    
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    private List<Rutina> rutinas = new ArrayList<>();
    
    @OneToMany(mappedBy = "entrenador", fetch = FetchType.LAZY)
    private List<Rutina> rutinasComoEntrenador = new ArrayList<>();
    
    // Helper methods
    public void addMembresia(Membresia membresia) {
        membresias.add(membresia);
        membresia.setCliente(this);
    }
    
    public void addRutina(Rutina rutina) {
        rutinas.add(rutina);
        rutina.setCliente(this);
    }
    
    public void addRutinaComoEntrenador(Rutina rutina) {
        rutinasComoEntrenador.add(rutina);
        rutina.setEntrenador(this);
    }

    //add getters and setters

    public List<Rutina> getRutinasComoEntrenador() {
        return rutinasComoEntrenador;
    }

    public void setRutinasComoEntrenador(List<Rutina> rutinasComoEntrenador) {
        this.rutinasComoEntrenador = rutinasComoEntrenador;
    }


    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public List<Membresia> getMembresias() {
        return membresias;
    }

    public void setMembresias(List<Membresia> membresias) {
        this.membresias = membresias;
    }

    public List<Rutina> getRutinas() {
        return rutinas;
    }

    public void setRutinas(List<Rutina> rutinas) {
        this.rutinas = rutinas;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public TipoUsuario getTipo() {
        return tipo;
    }

    public void setTipo(TipoUsuario tipo) {
        this.tipo = tipo;
    }

    
}