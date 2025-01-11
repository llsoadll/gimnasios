package com.gimnasio.gestion;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.UsuarioRepository;
import com.gimnasio.gestion.service.UsuarioService;
import com.gimnasio.gestion.config.TestConfig;
import com.gimnasio.gestion.enums.TipoUsuario;

@SpringBootTest
@Import(TestConfig.class)
class GestionGimnasioApplicationTests {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @MockBean
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private Usuario usuarioTest;

    @BeforeEach
    void setup() {
        usuarioTest = new Usuario();
        usuarioTest.setId(1L);
        usuarioTest.setNombre("Test");
        usuarioTest.setEmail("test@test.com");
        usuarioTest.setPassword(passwordEncoder.encode("password"));
        usuarioTest.setTipo(TipoUsuario.CLIENTE); // Changed from setTipo to setRole
        usuarioTest.setActivo(true);
    }

    @Test
    void contextLoads() {
        assertNotNull(usuarioService, "El servicio de usuarios no debería ser null");
    }

    @Test
    void testCrearUsuario() {
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioTest);
        
        Usuario resultado = usuarioService.guardarUsuario(usuarioTest);
        
        assertNotNull(resultado);
        assertEquals("Test", resultado.getNombre());
        assertEquals("test@test.com", resultado.getEmail());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void testObtenerUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioTest));
        
        Optional<Usuario> resultado = usuarioRepository.findById(1L);
        
        assertTrue(resultado.isPresent());
        assertEquals("Test", resultado.get().getNombre());
    }

    @Test
void testEliminarUsuario() {
    when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioTest));
    doNothing().when(usuarioRepository).delete(any(Usuario.class));
    
    assertDoesNotThrow(() -> usuarioService.eliminarUsuario(1L));
    
    verify(usuarioRepository).delete(any(Usuario.class)); // Cambiar a verificar delete() en lugar de deleteById()
}

    @Test
    void testObtenerTodosLosUsuarios() {
        List<Usuario> usuarios = Arrays.asList(usuarioTest);
        when(usuarioRepository.findAll()).thenReturn(usuarios);
        
        List<Usuario> resultado = usuarioService.obtenerTodos();
        
        assertNotNull(resultado);
        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
    }

    @Test
    void testCambiarEstadoUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioTest));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioTest);
        
        assertDoesNotThrow(() -> usuarioService.cambiarEstado(1L, false));
        
        verify(usuarioRepository).save(any(Usuario.class));
    }
}