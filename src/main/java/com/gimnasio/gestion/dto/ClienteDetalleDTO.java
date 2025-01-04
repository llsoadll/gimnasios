package com.gimnasio.gestion.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class ClienteDetalleDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private LocalDate fechaNacimiento;
    private String telefono;
    private boolean activo;
    private List<MembresiaDTO> membresias = new ArrayList<>();
    private List<RutinaDTO> rutinas = new ArrayList<>();
    private List<PagoDTO> pagos = new ArrayList<>();
    private List<SeguimientoDTO> seguimientos = new ArrayList<>();
    private List<ClaseDTO> clasesInscritas = new ArrayList<>();
}