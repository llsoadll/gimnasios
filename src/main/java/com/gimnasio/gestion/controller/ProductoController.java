package com.gimnasio.gestion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

import com.gimnasio.gestion.model.Producto;
import com.gimnasio.gestion.service.ProductoService;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductoController {
    @Autowired
    private ProductoService productoService;
    
    @GetMapping
    public ResponseEntity<List<Producto>> obtenerProductos() {
        return ResponseEntity.ok(productoService.obtenerTodos());
    }
    
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productoService.guardar(producto));
    }

    @PostMapping("/{id}/venta")
public ResponseEntity<Producto> venderProducto(
    @PathVariable Long id, 
    @RequestBody Map<String, Object> body) {
    
    System.out.println("Body recibido: " + body); // Debug
    Long userId = Long.valueOf(body.get("userId").toString());
    System.out.println("UserId extraído: " + userId); // Debug
    
    return ResponseEntity.ok(productoService.realizarVenta(id, userId));
}
}