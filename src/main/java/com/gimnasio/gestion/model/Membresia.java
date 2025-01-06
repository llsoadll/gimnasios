package com.gimnasio.gestion.model;

import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.*;
import lombok.Data;
import com.gimnasio.gestion.enums.TipoMembresia;

@Entity
@Table(name = "membresias")
@Data
public class Membresia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;
    
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Double precio;
    private boolean activa;
    
    @Enumerated(EnumType.STRING)
    private TipoMembresia tipo;
    
    @OneToMany(mappedBy = "membresia")
    private List<Pago> pagos;

    @PreUpdate
@PrePersist
public void validarFechas() {
    if (this.fechaFin != null && this.fechaFin.isBefore(LocalDate.now())) {
        this.activa = false;
        }
    }
}