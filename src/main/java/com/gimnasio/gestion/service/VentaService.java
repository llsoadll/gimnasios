package com.gimnasio.gestion.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gimnasio.gestion.dto.ClienteVentaDTO;
import com.gimnasio.gestion.dto.ProductoVentaDTO;
import com.gimnasio.gestion.dto.VentaDTO;
import com.gimnasio.gestion.repository.VentaRepository;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Transactional(readOnly = true)
    public List<VentaDTO> obtenerVentas() {
        return ventaRepository.findAll().stream()
            .map(venta -> {
                VentaDTO dto = new VentaDTO();
                dto.setId(venta.getId());
                dto.setFecha(venta.getFecha());
                dto.setCantidad(venta.getCantidad());
                dto.setPrecioUnitario(venta.getPrecioUnitario());
                dto.setTotal(venta.getTotal());
                dto.setMetodoPago(venta.getMetodoPago());

                ClienteVentaDTO clienteDTO = new ClienteVentaDTO();
                clienteDTO.setId(venta.getCliente().getId());
                clienteDTO.setNombre(venta.getCliente().getNombre());
                clienteDTO.setApellido(venta.getCliente().getApellido());
                dto.setCliente(clienteDTO);

                ProductoVentaDTO productoDTO = new ProductoVentaDTO();
                productoDTO.setId(venta.getProducto().getId());
                productoDTO.setNombre(venta.getProducto().getNombre());
                dto.setProducto(productoDTO);

                return dto;
            })
            .collect(Collectors.toList());
    }
}