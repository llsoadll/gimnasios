package com.gimnasio.gestion.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.gimnasio.gestion.dto.MembresiaDTO;
import com.gimnasio.gestion.model.Membresia;
import com.gimnasio.gestion.model.Usuario;
import com.gimnasio.gestion.repository.MembresiaRepository;
import com.gimnasio.gestion.repository.UsuarioRepository;
import com.gimnasio.gestion.enums.TipoMembresia;
import com.gimnasio.gestion.enums.TipoUsuario;
import com.gimnasio.gestion.mapper.MembresiaMapper;

@SpringBootTest
class MembresiaServiceTest {

    @Autowired
    private MembresiaService membresiaService;

    @MockBean
    private MembresiaRepository membresiaRepository;

    @MockBean
    private UsuarioRepository usuarioRepository;

    @MockBean
    private MembresiaMapper membresiaMapper;

    private Membresia membresiaTest;
    private Usuario usuarioTest;
    private MembresiaDTO membresiaDTO;

    @BeforeEach
    void setup() {
        // Setup usuario test
        usuarioTest = new Usuario();
        usuarioTest.setId(1L);
        usuarioTest.setNombre("Test Cliente");
        usuarioTest.setApellido("Apellido");
        usuarioTest.setEmail("cliente@test.com");
        usuarioTest.setTelefono("1234567890");
        usuarioTest.setTipo(TipoUsuario.CLIENTE);
        usuarioTest.setActivo(true);

        // Setup membresia test
        membresiaTest = new Membresia();
        membresiaTest.setId(1L);
        membresiaTest.setCliente(usuarioTest);
        membresiaTest.setTipo(TipoMembresia.MENSUAL);
        membresiaTest.setFechaInicio(LocalDate.now());
        membresiaTest.setPrecio(1000.0);
        membresiaTest.setActiva(true);

        // Setup DTO
        membresiaDTO = new MembresiaDTO();
        membresiaDTO.setId(1L);
        membresiaDTO.setClienteId(1L);
        membresiaDTO.setTipo(TipoMembresia.MENSUAL);
        membresiaDTO.setPrecio(1000.0);
    }

    @Test
    void testCrearMembresia() {
        // Setup mocks
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioTest));
        when(membresiaRepository.save(any(Membresia.class))).thenReturn(membresiaTest);
        when(membresiaMapper.toEntity(any(MembresiaDTO.class))).thenAnswer(invocation -> {
            MembresiaDTO dto = invocation.getArgument(0);
            Membresia membresia = new Membresia();
            membresia.setCliente(usuarioTest);
            membresia.setTipo(dto.getTipo());
            membresia.setPrecio(dto.getPrecio());
            membresia.setFechaInicio(LocalDate.now());
            membresia.setActiva(true);
            return membresia;
        });
        when(membresiaMapper.toDTO(any(Membresia.class))).thenReturn(membresiaDTO);

        // Execute test
        MembresiaDTO resultado = membresiaService.crearMembresia(membresiaDTO);

        // Verify
        assertNotNull(resultado);
        assertEquals(membresiaDTO.getTipo(), resultado.getTipo());
        assertEquals(membresiaDTO.getPrecio(), resultado.getPrecio());
        verify(membresiaRepository).save(any(Membresia.class));
        verify(membresiaMapper).toDTO(any(Membresia.class));
    }

    @Test
    void testObtenerMembresias() {
        when(membresiaRepository.findAll()).thenReturn(Arrays.asList(membresiaTest));

        var resultado = membresiaService.obtenerTodas();

        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
    }
}