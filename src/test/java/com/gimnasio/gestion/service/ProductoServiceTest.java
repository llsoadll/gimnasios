package com.gimnasio.gestion.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.gimnasio.gestion.enums.TipoUsuario;
import com.gimnasio.gestion.model.Producto;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.model.Venta;
import com.gimnasio.gestion.repository.ProductoRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;
import com.gimnasio.gestion.repository.VentaRepository;

@SpringBootTest
class ProductoServiceTest {
    @Autowired
    private ProductoService productoService;

    @MockBean // Agregar mock para VentaRepository
    private VentaRepository ventaRepository;
    
    @MockBean
    private ProductoRepository productoRepository;

    @MockBean  // Agregar esta anotación
    private UsuarioRepository usuarioRepository;
    
     @Test
    void testRealizarVentaActualizaStock() {
        // Preparar producto y usuario de prueba
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Test");
        producto.setDescripcion("Producto test");
        producto.setStock(10);
        producto.setPrecio(1000.0);
        producto.setCategoria("BEBIDAS");
        producto.setImagen("test.jpg");
        
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Test");
        usuario.setApellido("Test");
        usuario.setEmail("test@test.com");
        usuario.setTipo(TipoUsuario.CLIENTE);
        usuario.setActivo(true);
        usuario.setUsername("testuser");
        usuario.setPassword("password");
        
        // Configurar comportamiento de los mocks
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);
        when(ventaRepository.save(any(Venta.class))).thenAnswer(i -> i.getArguments()[0]);
        
        // Ejecutar venta
        productoService.realizarVenta(1L, 1L, 3, "TARJETA");
        
        // Verificar que el stock se actualizó
        verify(productoRepository).save(argThat(p -> p.getStock() == 7));
        verify(ventaRepository).save(any(Venta.class));
    }
    
    @Test
    void testVentaConStockInsuficiente() {
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setStock(2);
        
        when(productoRepository.findById(1L))
            .thenReturn(Optional.of(producto));
            
        assertThrows(RuntimeException.class, () -> 
            productoService.realizarVenta(1L, 1L, 3, "TARJETA"));
    }
}