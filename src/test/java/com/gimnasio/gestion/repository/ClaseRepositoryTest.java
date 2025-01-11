package com.gimnasio.gestion.repository;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.gimnasio.gestion.enums.TipoUsuario;
import com.gimnasio.gestion.model.Clase;
import com.gimnasio.gestion.model.Usuario;

@DataJpaTest
class ClaseRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ClaseRepository claseRepository;

    @Test
void testGuardarClase() {
    Usuario entrenador = new Usuario();
    entrenador.setNombre("Entrenador Test");
    entrenador.setEmail("entrenador@test.com");  // Required
    entrenador.setTelefono("1234567890");        // Required
    entrenador.setApellido("Apellido");          // Required
    entrenador.setTipo(TipoUsuario.ENTRENADOR);  // Required
    entrenador.setActivo(true);                  // Required
    entityManager.persist(entrenador);

    Clase clase = new Clase();
    clase.setNombre("Clase Test");
    clase.setDescripcion("Descripción test");
    clase.setDia("LUNES");
    clase.setHorario("10:00");
    clase.setCupo(20);
    clase.setEntrenador(entrenador);

    Clase savedClase = claseRepository.save(clase);
    assertNotNull(savedClase.getId());
}

@Test
void testBuscarClase() {
    // Create test entrenador
    Usuario entrenador = new Usuario();
    entrenador.setNombre("Entrenador Test");
    entrenador.setApellido("Apellido");
    entrenador.setEmail("entrenador.test@test.com");  // Unique email
    entrenador.setTelefono("1234567890");
    entrenador.setTipo(TipoUsuario.ENTRENADOR);
    entrenador.setActivo(true);
    entityManager.persist(entrenador);

    // Create test clase
    Clase clase = new Clase();
    clase.setNombre("Clase Test");
    clase.setDescripcion("Descripción test");
    clase.setDia("LUNES");
    clase.setHorario("10:00");
    clase.setCupo(20);
    clase.setEntrenador(entrenador);
    entityManager.persist(clase);
    entityManager.flush();

    Clase found = claseRepository.findById(clase.getId()).orElse(null);
    assertNotNull(found);
    assertEquals(clase.getNombre(), found.getNombre());
}
}