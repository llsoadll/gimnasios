package com.gimnasio.gestion.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gimnasio.gestion.service.ProductoService;

@SpringBootTest
@AutoConfigureMockMvc
class ProductoControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ProductoService productoService;
    
    @Test
    void testRealizarVenta() throws Exception {
        Map<String, Object> ventaRequest = new HashMap<>();
        ventaRequest.put("userId", 1);
        ventaRequest.put("cantidad", 3);
        ventaRequest.put("metodoPago", "TARJETA");
        
        mockMvc.perform(post("/api/productos/1/venta")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new ObjectMapper().writeValueAsString(ventaRequest)))
            .andExpect(status().isOk());
    }
}