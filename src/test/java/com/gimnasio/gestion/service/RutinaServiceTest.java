package com.gimnasio.gestion.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

import com.gimnasio.gestion.config.TestConfig;
import com.gimnasio.gestion.dto.RutinaDTO;
import com.gimnasio.gestion.enums.TipoUsuario;
import com.gimnasio.gestion.mapper.RutinaMapper;
import com.gimnasio.gestion.model.Rutina;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.RutinaRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;

@SpringBootTest
@Import(TestConfig.class)
class RutinaServiceTest {

    @Autowired
    private RutinaService rutinaService;

    @MockBean
    private RutinaRepository rutinaRepository;

    @MockBean
    private UsuarioRepository usuarioRepository;
    
    @MockBean
    private RutinaMapper rutinaMapper;  // Agregar este mock

    private Rutina rutinaTest;
    private Usuario clienteTest;
    private Usuario entrenadorTest;
    private RutinaDTO rutinaDTOTest;    // Agregar este DTO para tests

    @BeforeEach
void setup() {
    clienteTest = new Usuario();
    clienteTest.setId(1L);
    clienteTest.setNombre("Cliente Test");
    clienteTest.setApellido("Apellido");
    clienteTest.setEmail("cliente@test.com");
    clienteTest.setTelefono("1234567890");
    clienteTest.setTipo(TipoUsuario.CLIENTE);
    clienteTest.setActivo(true);

    entrenadorTest = new Usuario();
    entrenadorTest.setId(2L);
    entrenadorTest.setNombre("Entrenador Test");
    entrenadorTest.setApellido("Apellido");
    entrenadorTest.setEmail("entrenador@test.com");
    entrenadorTest.setTelefono("0987654321");
    entrenadorTest.setTipo(TipoUsuario.ENTRENADOR);
    entrenadorTest.setActivo(true);

    rutinaTest = new Rutina();
    rutinaTest.setId(1L);
    rutinaTest.setNombre("Rutina Test");
    rutinaTest.setDescripcion("Descripción test");
    rutinaTest.setCliente(clienteTest);
    rutinaTest.setEntrenador(entrenadorTest);
}

@Test
void testCrearRutina() {
    // Create DTOs and mocks
    RutinaDTO rutinaDTO = new RutinaDTO();
    rutinaDTO.setNombre("Rutina Test");
    rutinaDTO.setDescripcion("Descripción test");
    rutinaDTO.setClienteId(1L);
    rutinaDTO.setEntrenadorId(2L);

    when(usuarioRepository.findById(1L)).thenReturn(Optional.of(clienteTest));
    when(usuarioRepository.findById(2L)).thenReturn(Optional.of(entrenadorTest));
    when(rutinaRepository.save(any(Rutina.class))).thenAnswer(invocation -> {
        Rutina rutina = invocation.getArgument(0);
        rutina.setId(1L);
        return rutina;
    });
    when(rutinaMapper.toEntity(any(RutinaDTO.class))).thenAnswer(invocation -> {
        RutinaDTO dto = invocation.getArgument(0);
        Rutina rutina = new Rutina();
        rutina.setNombre(dto.getNombre());
        rutina.setDescripcion(dto.getDescripcion());
        rutina.setCliente(clienteTest);
        rutina.setEntrenador(entrenadorTest);
        return rutina;
    });
    when(rutinaMapper.toDTO(any(Rutina.class))).thenAnswer(invocation -> {
        Rutina rutina = invocation.getArgument(0);
        RutinaDTO dto = new RutinaDTO();
        dto.setId(rutina.getId());
        dto.setNombre(rutina.getNombre());
        dto.setDescripcion(rutina.getDescripcion());
        return dto;
    });

    RutinaDTO resultado = rutinaService.crearRutina(rutinaDTO);
    assertNotNull(resultado);
    assertEquals("Rutina Test", resultado.getNombre());
}

    @Test
    void testObtenerRutinas() {
        when(rutinaRepository.findAll()).thenReturn(Arrays.asList(rutinaTest));

        var resultado = rutinaService.obtenerTodas();

        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
    }
}