package com.gimnasio.gestion.integration;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gimnasio.gestion.enums.TipoUsuario;
import com.gimnasio.gestion.model.Producto;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.ProductoRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;

@SpringBootTest
@AutoConfigureMockMvc
class ProductoIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ProductoRepository productoRepository;

        @Autowired
    private UsuarioRepository usuarioRepository; 

    @Autowired
    private ObjectMapper objectMapper; 
    
    @Test
void testFlujoCompletoVenta() throws Exception {  // Agregar throws Exception
    // Crear y guardar usuario primero
    Usuario usuario = new Usuario();
    usuario.setNombre("Test");
    usuario.setApellido("User");
    usuario.setEmail("test" + System.currentTimeMillis() + "@test.com"); 
    usuario.setTipo(TipoUsuario.CLIENTE);
    usuario.setActivo(true);
    usuario.setUsername("testuser");
    usuario.setPassword("password");
    
    usuario = usuarioRepository.save(usuario);

    // Crear y guardar producto
    Producto producto = new Producto();
    producto.setNombre("Test");
    producto.setDescripcion("Producto test");
    producto.setStock(10);
    producto.setPrecio(1000.0);
    producto.setCategoria("BEBIDAS");
    producto.setImagen("test.jpg");
    
    producto = productoRepository.save(producto);
    
    // Realizar la venta
    Map<String, Object> ventaRequest = new HashMap<>();
    ventaRequest.put("cantidad", 3);
    ventaRequest.put("userId", usuario.getId());
    ventaRequest.put("metodoPago", "TARJETA");
    
    mockMvc.perform(post("/api/productos/" + producto.getId() + "/venta")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(ventaRequest)))
            .andExpect(status().isOk());
            
    // Verificar actualización de stock
    Producto productoActualizado = productoRepository.findById(producto.getId()).orElseThrow();
    assertEquals(7, productoActualizado.getStock());
}
}