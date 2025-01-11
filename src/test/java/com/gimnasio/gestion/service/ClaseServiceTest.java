package com.gimnasio.gestion.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.gimnasio.gestion.dto.ClaseDTO;
import com.gimnasio.gestion.model.Clase;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.ClaseRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;
import com.gimnasio.gestion.repository.InscripcionClaseRepository;

@SpringBootTest
class ClaseServiceTest {

    @Autowired
    private ClaseService claseService;

    @MockBean
    private ClaseRepository claseRepository;

    @MockBean
    private UsuarioRepository usuarioRepository;

    @MockBean
    private InscripcionClaseRepository inscripcionClaseRepository;

    private Clase claseTest;
    private Usuario entrenadorTest;

    @BeforeEach
    void setup() {
        entrenadorTest = new Usuario();
        entrenadorTest.setId(1L);
        entrenadorTest.setNombre("Entrenador Test");

        claseTest = new Clase();
        claseTest.setId(1L);
        claseTest.setNombre("Clase Test");
        claseTest.setDescripcion("Descripción test");
        claseTest.setDia("LUNES");
        claseTest.setHorario("10:00");
        claseTest.setCupo(20);
        claseTest.setEntrenador(entrenadorTest);
    }

    @Test
    void testCrearClase() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(entrenadorTest));
        when(claseRepository.save(any(Clase.class))).thenReturn(claseTest);

        ClaseDTO claseDTO = new ClaseDTO();
        claseDTO.setNombre("Clase Test");
        
        ClaseDTO resultado = claseService.crearClase(claseDTO);

        assertNotNull(resultado);
        assertEquals("Clase Test", resultado.getNombre());
        verify(claseRepository).save(any(Clase.class));
    }

    @Test
    void testObtenerClases() {
        when(claseRepository.findAll()).thenReturn(Arrays.asList(claseTest));

        var resultado = claseService.obtenerTodas();

        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
    }
}