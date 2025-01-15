package com.gimnasio.gestion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.gimnasio.gestion.exception.ResourceNotFoundException;
import com.gimnasio.gestion.model.CajaIngreso;
import com.gimnasio.gestion.model.Producto;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.model.Venta;
import com.gimnasio.gestion.repository.CajaIngresoRepository;
import com.gimnasio.gestion.repository.ProductoRepository;

import org.springframework.security.core.Authentication;
import com.gimnasio.gestion.repository.UsuarioRepository;
import com.gimnasio.gestion.repository.VentaRepository;

@Service
@Transactional
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CajaIngresoRepository cajaIngresoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository; 

    @Autowired
    private VentaRepository ventaRepository; 
    
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }
    
    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    @Transactional
public Producto realizarVenta(Long productoId, Long userId, String metodoPago) {
    try {
        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
            
        Usuario cliente = usuarioRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (producto.getStock() <= 0) {
            throw new RuntimeException("No hay stock disponible");
        }

        Venta venta = new Venta();
        venta.setProducto(producto);
        venta.setCliente(cliente);
        venta.setFecha(LocalDateTime.now());
        venta.setCantidad(1);
        venta.setPrecioUnitario(producto.getPrecio());
        venta.setTotal(producto.getPrecio());
        venta.setMetodoPago(metodoPago);
        
        ventaRepository.save(venta);
        
        // Guardar venta
        ventaRepository.save(venta);

        // Registrar en caja
        CajaIngreso ingreso = new CajaIngreso();
        ingreso.setFecha(LocalDateTime.now().toLocalDate());
        ingreso.setMonto(producto.getPrecio());
        ingreso.setConcepto("VENTA_PRODUCTO");
        ingreso.setCliente(cliente);
        cajaIngresoRepository.save(ingreso);

        // Actualizar stock
        producto.setStock(producto.getStock() - 1);
        return productoRepository.save(producto);
        
    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Error al realizar la venta: " + e.getMessage());
    }
}

public void eliminarProducto(Long id) {
    Producto producto = productoRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        
    // Primero eliminar las ventas asociadas
    ventaRepository.deleteByProducto(producto);
    
    // Luego eliminar el producto
    productoRepository.delete(producto);
}
}
