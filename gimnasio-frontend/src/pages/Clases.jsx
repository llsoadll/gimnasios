import React, { useState, useEffect } from 'react';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper, 
  Button, 
  Dialog, 
  TextField, 
  FormControl, 
  Select, 
  MenuItem,
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Alert, 
  CircularProgress,
  Box,
  InputLabel,
  Typography
} from '@mui/material';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import api from '../utils/axios';
import { Event, PeopleAlt } from '@mui/icons-material';

const Clases = () => {
  const [clases, setClases] = useState([]);
  const [mensaje, setMensaje] = useState(null); 
  const userId = localStorage.getItem('userId'); // Obtener ID del usuario actual
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario
  const [clientes, setClientes] = useState([]);
  const [inscripcionDialogOpen, setInscripcionDialogOpen] = useState(false);
  const [selectedClase, setSelectedClase] = useState(null);
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [inscripciones, setInscripciones] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alumnosDialogOpen, setAlumnosDialogOpen] = useState(false);
const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [error, setError] = useState(null);
  const [itemsPorPagina] = useState(10);
const [paginaActual, setPaginaActual] = useState(1);
const [searchTerm, setSearchTerm] = useState('');
const [filterDia, setFilterDia] = useState('');
  const [searchClientTerm, setSearchClientTerm] = useState('');
  const handleOpenInscripcionDialog = (clase) => {
    setSelectedClase(clase);
    fetchClientes(); // Cargar clientes antes de abrir el diálogo
    setInscripcionDialogOpen(true);
  };
  const [nuevaClase, setNuevaClase] = useState({
    nombre: '',
    descripcion: '',
    horario: '',
    cupo: '',
    entrenadorId: '',
    dia: 'LUNES'
  });

  useEffect(() => {
    fetchClases();
    fetchEntrenadores();
    fetchClientes();
  }, []);

  const fetchClases = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await api.get('/clases');
        console.log('Clases cargadas:', response.data); // Debug
        const data = Array.isArray(response.data) ? response.data : [];
        setClases(data);
    } catch (err) {
        setError('Error al cargar clases');
        console.error('Error:', err);
    } finally {
        setLoading(false);
    }
};


// Paginar las clases
const clasesFiltradas = clases.filter(clase => {
  const matchSearch = searchTerm === '' || 
    clase.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${clase.entrenador?.nombre} ${clase.entrenador?.apellido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
      
  const matchDia = filterDia === '' || clase.dia === filterDia;
      
  return matchSearch && matchDia;
});

const totalPaginas = Math.ceil(clasesFiltradas.length / itemsPorPagina);

const clasesAPaginar = clasesFiltradas.slice(
  (paginaActual - 1) * itemsPorPagina,
  paginaActual * itemsPorPagina
);


const darDeBajaCliente = async (inscripcionId) => {
  if (window.confirm('¿Está seguro de dar de baja a este cliente?')) {
    try {
      await api.post(`/clases/inscripciones/${inscripcionId}/cancelar`);
      await fetchClases(); // Recargar las clases
      setMensaje("Cliente dado de baja exitosamente");
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setError('Error al dar de baja al cliente');
      console.error('Error:', err);
    }
  }
};

const darmedeBaja = async (claseId) => {
  try {
    // Buscar la inscripción del usuario en la clase
    const inscripcion = clases.find(c => c.id === claseId)
      ?.clientesInscritos?.find(c => c.id === parseInt(userId));
    
    if (!inscripcion) {
      setError('No se encontró tu inscripción');
      return;
    }

    await api.post(`/clases/inscripciones/${inscripcion.inscripcionId}/cancelar`);
    fetchClases();
    setMensaje("Te has dado de baja exitosamente");
    setTimeout(() => setMensaje(null), 3000);
  } catch (err) {
    console.error('Error al darse de baja:', err);
    setError('Error al darse de baja de la clase');
  }
};

const estaInscrito = (clase) => {
  return clase.clientesInscritos?.some(cliente => cliente.id === parseInt(userId));
};

const inscribirme = async (claseId) => {
  try {
    const response = await api.post(`/clases/${claseId}/inscribir/${userId}`);
    
    if (response.status === 200) {
      fetchClases();
      setMensaje("¡Te has inscrito exitosamente!");
      setTimeout(() => setMensaje(null), 3000); // El mensaje desaparece después de 3 segundos
    }
  } catch (err) {
    console.error('Error al inscribirse:', err);
    setError('Ya estás inscrito en esta clase o ha ocurrido un error');
  }
};

  const fetchEntrenadores = async () => {
    try {
      const response = await api.get('/usuarios');
      setEntrenadores(response.data.filter(u => u.tipo === 'ENTRENADOR'));
    } catch (err) {
      setError('Error al cargar entrenadores');
      console.error('Error:', err);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get('/usuarios');
      setClientes(response.data.filter(u => u.tipo === 'CLIENTE'));
    } catch (err) {
      setError('Error al cargar clientes');
    }
  };

  const inscribirCliente = async () => {
    try {
      await api.post(`/clases/${selectedClase.id}/inscribir/${selectedClienteId}`);
      setInscripcionDialogOpen(false);
      await fetchClases(); // Recargar las clases para actualizar los cupos
      setSelectedClienteId('');
    } catch (err) {
      setError('Error al inscribir cliente');
      console.error('Error:', err);
    }
  };

  const agregarClase = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        const claseData = {
            nombre: nuevaClase.nombre,
            descripcion: nuevaClase.descripcion,
            dia: nuevaClase.dia,
            horario: nuevaClase.horario,
            cupo: parseInt(nuevaClase.cupo),
            entrenador: {
                id: parseInt(nuevaClase.entrenadorId)
            }
        };

        await api.post('/clases', claseData);
        await fetchClases();
        setOpenDialog(false);
        setNuevaClase({
            nombre: '',
            descripcion: '',
            horario: '',
            cupo: '',
            entrenadorId: '',
            dia: 'LUNES'
        });
    } catch (err) {
        setError(`Error al crear clase: ${err.response?.data?.message || err.message}`);
        console.error('Error:', err);
    } finally {
        setLoading(false);
    }
};

  const eliminarClase = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta clase?')) {
      try {
        await api.delete(`/clases/${id}`);
        setClases(clases.filter(c => c.id !== id));
      } catch (err) {
        setError('Error al eliminar clase');
        console.error('Error:', err);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

  return (
    <>
      {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid #1976d2', pb: 2 }}>
      <Event 
        sx={{ 
          fontSize: 35, 
          mr: 2, 
          color: 'primary.main',
          transform: 'rotate(-15deg)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'rotate(0deg) scale(1.1)'
          }
        }} 
      />
      <Typography 
        variant="h5" 
        sx={{
          fontWeight: 600,
          background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        Listado de Clases
      </Typography>
    </Box>

    <Box sx={{ 
  mb: 2, 
  display: 'flex', 
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 2,
  alignItems: { xs: 'stretch', sm: 'center' }
}}>
  <TextField
    label="Buscar clase"
    variant="outlined"
    size="small"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    sx={{ width: { xs: '100%', sm: 300 } }}
    placeholder="Buscar por nombre o entrenador..."
  />
  
  <FormControl size="small" sx={{ width: { xs: '100%', sm: 200 } }}>
    <InputLabel>Día</InputLabel>
    <Select
      value={filterDia}
      onChange={(e) => setFilterDia(e.target.value)}
      label="Día"
    >
      <MenuItem value="">Todos</MenuItem>
      <MenuItem value="LUNES">Lunes</MenuItem>
      <MenuItem value="MARTES">Martes</MenuItem>
      <MenuItem value="MIÉRCOLES">Miércoles</MenuItem>
      <MenuItem value="JUEVES">Jueves</MenuItem>
      <MenuItem value="VIERNES">Viernes</MenuItem>
      <MenuItem value="SÁBADO">Sábado</MenuItem>
    </Select>
  </FormControl>

  {userRole === 'ADMIN' && (
    <Button 
      variant="contained" 
      onClick={() => setOpenDialog(true)}
      sx={{ 
        width: { xs: '100%', sm: 'auto' },
        alignSelf: { sm: 'flex-start' }
      }}
    >
      Nueva Clase
    </Button>
  )}
</Box>


<TableContainer component={Paper}>
  <Table>
  <TableHead>
  <TableRow>
    <TableCell>Nombre</TableCell>
    <TableCell>Descripción</TableCell>
    <TableCell>Día</TableCell>
    <TableCell>Horario</TableCell>
    <TableCell>Cupos Total</TableCell>
    <TableCell>Cupos Disponibles</TableCell>
    <TableCell>Entrenador</TableCell>
    {userRole === 'ADMIN' && <TableCell>Alumnos</TableCell>}
    <TableCell>Inscripción</TableCell>
    {userRole === 'ADMIN' && <TableCell>Acciones</TableCell>}
  </TableRow>
</TableHead>
<TableBody>
{clasesAPaginar.map((clase) => (
    <TableRow key={clase.id}>
      <TableCell>{clase.nombre}</TableCell>
      <TableCell>{clase.descripcion}</TableCell>
      <TableCell>{clase.dia}</TableCell>
      <TableCell>{clase.horario}</TableCell>
      <TableCell>{clase.cupo}</TableCell>
      <TableCell>{clase.cuposDisponibles}</TableCell>
      <TableCell>{`${clase.entrenador?.nombre} ${clase.entrenador?.apellido}`}</TableCell>
      {userRole === 'ADMIN' && (
        <TableCell>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setClaseSeleccionada(clase);
              setAlumnosDialogOpen(true);
            }}
            startIcon={<PeopleAlt />}
          >
            Ver Alumnos ({clase.clientesInscritos?.length || 0})
          </Button>
        </TableCell>
      )}
      <TableCell>
      {userRole === 'ADMIN' ? (
    <Button
      variant="contained"
      color="primary"
      onClick={() => handleOpenInscripcionDialog(clase)}
      disabled={clase.cuposDisponibles === 0}
    >
      Inscribir Cliente
    </Button>
  ) : userRole === 'CLIENTE' && (
    estaInscrito(clase) ? (
      <Button
        variant="contained"
        color="error"
        onClick={() => darmedeBaja(clase.id)}
      >
        Darme de baja
      </Button>
    ) : (
      <Button
        variant="contained"
        color="primary"
        onClick={() => inscribirme(clase.id)}
        disabled={clase.cuposDisponibles === 0}
      >
        Inscribirme
      </Button>
    )
  )}
      </TableCell>
      {userRole === 'ADMIN' && (
        <TableCell>
          <Button
            variant="contained"
            color="error"
            onClick={() => eliminarClase(clase.id)}
            size="small"
          >
            Eliminar
          </Button>
        </TableCell>
      )}
    </TableRow>
  ))}
</TableBody>
  </Table>
</TableContainer>


<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
  <Button 
    disabled={paginaActual === 1 || clasesFiltradas.length === 0} 
    onClick={() => setPaginaActual(prev => prev - 1)}
  >
    Anterior
  </Button>
  <Typography sx={{ alignSelf: 'center' }}>
    Página {clasesFiltradas.length === 0 ? 0 : paginaActual} de {clasesFiltradas.length === 0 ? 0 : totalPaginas}
  </Typography>
  <Button 
    disabled={paginaActual === totalPaginas || clasesFiltradas.length === 0} 
    onClick={() => setPaginaActual(prev => prev + 1)}
  >
    Siguiente
  </Button>
</Box>



{/* Diálogo para mostrar alumnos */}
<Dialog 
  open={alumnosDialogOpen} 
  onClose={() => setAlumnosDialogOpen(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    Alumnos Inscriptos - {claseSeleccionada?.nombre}
  </DialogTitle>
  <DialogContent>
    {claseSeleccionada?.clientesInscritos?.length > 0 ? (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claseSeleccionada.clientesInscritos.map(cliente => (
              <TableRow key={cliente.id}>
                <TableCell>{`${cliente.nombre} ${cliente.apellido}`}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      darDeBajaCliente(cliente.inscripcionId);
                      setAlumnosDialogOpen(false);
                    }}
                  >
                    Dar de baja
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography>No hay alumnos inscriptos</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setAlumnosDialogOpen(false)}>
      Cerrar
    </Button>
  </DialogActions>
</Dialog>


      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Nueva Clase</DialogTitle>
        <DialogContent>
          <form onSubmit={agregarClase}>
            <TextField 
              fullWidth
              margin="normal"
              label="Nombre" 
              value={nuevaClase.nombre}
              onChange={e => setNuevaClase({...nuevaClase, nombre: e.target.value})}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Descripción"
              multiline
              rows={4}
              value={nuevaClase.descripcion}
              onChange={e => setNuevaClase({...nuevaClase, descripcion: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <Select
                value={nuevaClase.dia}
                onChange={e => setNuevaClase({...nuevaClase, dia: e.target.value})}
              >
                {diasSemana.map(dia => (
                  <MenuItem key={dia} value={dia}>
                    {dia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField 
              fullWidth
              margin="normal"
              label="Horario"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={nuevaClase.horario}
              onChange={e => setNuevaClase({...nuevaClase, horario: e.target.value})}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Cupo"
              type="number"
              value={nuevaClase.cupo}
              onChange={e => setNuevaClase({...nuevaClase, cupo: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <Select
                value={nuevaClase.entrenadorId}
                onChange={e => setNuevaClase({...nuevaClase, entrenadorId: e.target.value})}
                displayEmpty
              >
                <MenuItem value="" disabled>Seleccionar Entrenador</MenuItem>
                {entrenadores.map(entrenador => (
                  <MenuItem key={entrenador.id} value={entrenador.id}>
                    {`${entrenador.nombre} ${entrenador.apellido}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Guardar
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={inscripcionDialogOpen} onClose={() => setInscripcionDialogOpen(false)}>
  <DialogTitle>Inscribir Cliente en Clase</DialogTitle>
  <DialogContent>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    
    {loading ? (
      <Box display="flex" justifyContent="center" m={2}>
        <CircularProgress />
      </Box>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Buscar cliente"
          variant="outlined"
          size="small"
          value={searchClientTerm}
          onChange={(e) => setSearchClientTerm(e.target.value)}
          placeholder="Buscar por nombre..."
        />
        
        <FormControl fullWidth>
          <InputLabel>Seleccionar Cliente</InputLabel>
          <Select
            value={selectedClienteId}
            onChange={(e) => setSelectedClienteId(e.target.value)}
            label="Seleccionar Cliente"
          >
            <MenuItem value="" disabled>Seleccionar Cliente</MenuItem>
            {clientes
              .filter(cliente => 
                searchClientTerm === '' || 
                `${cliente.nombre} ${cliente.apellido}`
                  .toLowerCase()
                  .includes(searchClientTerm.toLowerCase())
              )
              .map(cliente => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {`${cliente.nombre} ${cliente.apellido}`}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button 
      onClick={() => {
        setInscripcionDialogOpen(false);
        setSelectedClienteId('');
      }}
    >
      Cancelar
    </Button>
    <Button 
      onClick={inscribirCliente} 
      variant="contained" 
      color="primary"
      disabled={!selectedClienteId || loading}
    >
      Inscribir
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
};

export default Clases;