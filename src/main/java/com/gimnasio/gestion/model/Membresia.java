package com.gimnasio.gestion.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.gimnasio.gestion.enums.TipoMembresia;

@Entity
@Table(name = "membresias")
@Data
public class Membresia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JsonBackReference
    private Usuario cliente;
    
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Double precio;
    private boolean activa;
    
    @Enumerated(EnumType.STRING)
    private TipoMembresia tipo;
    
    @OneToMany(mappedBy = "membresia")
    private List<Pago> pagos;

    //add getters and setters

    public boolean isActiva() {
        return activa;
    }

    public void setActiva(boolean activa) {
        this.activa = activa;
    }

    public List<Pago> getPagos() {
        return pagos;
    }

    public void setPagos(List<Pago> pagos) {
        this.pagos = pagos;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getCliente() {
        return cliente;
    }

    public void setCliente(Usuario cliente) {
        this.cliente = cliente;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public TipoMembresia getTipo() {
        return tipo;
    }

    public void setTipo(TipoMembresia tipo) {
        this.tipo = tipo;
    }

    
}