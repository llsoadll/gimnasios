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
import { Event } from '@mui/icons-material';

const Clases = () => {
  const [clases, setClases] = useState([]);
  const [mensaje, setMensaje] = useState(null); 
  const handleOpenInscripcionDialog = (clase) => {
    setSelectedClase(clase);
    fetchClientes(); // Cargar clientes antes de abrir el diálogo
    setInscripcionDialogOpen(true);
  };
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
  const [error, setError] = useState(null);
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

      {userRole === 'ADMIN' && (
      <Button 
        variant="contained" 
        onClick={() => setOpenDialog(true)} 
        sx={{ mb: 2 }}
      >
        Nueva Clase
      </Button>
      )}


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
        {userRole === 'ADMIN' && <TableCell>Alumnos Inscriptos</TableCell>}
        <TableCell>Inscripción</TableCell>
        <TableCell>Acciones</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
    {clases.map((clase) => (
  <TableRow key={clase.id}>
    <TableCell>{clase.nombre}</TableCell>
    <TableCell>{clase.descripcion}</TableCell>
    <TableCell>{clase.dia}</TableCell>
    <TableCell>{clase.horario}</TableCell>
    <TableCell>{clase.cuposTotal}</TableCell>
    <TableCell>{clase.cuposDisponibles}</TableCell>
    <TableCell>{`${clase.entrenador?.nombre} ${clase.entrenador?.apellido}`}</TableCell>
    {userRole === 'ADMIN' && (
      <TableCell>
      {clase.clientesInscritos?.length > 0 ? (
        <div>
          {clase.clientesInscritos.map(cliente => (
            <Box key={cliente.id} display="flex" alignItems="center" mb={1}>
              <Typography variant="body2">
                {`${cliente.nombre} ${cliente.apellido}`}
              </Typography>
              <Button
                size="small"
                color="error"
                onClick={() => darDeBajaCliente(cliente.inscripcionId)}
                sx={{ ml: 1 }}
              >
                Dar de baja
              </Button>
            </Box>
          ))}
        </div>
      ) : (
        <Typography variant="body2">No hay alumnos inscriptos</Typography>
      )}
    </TableCell>
    )}
    <TableCell>
      {userRole === 'ADMIN' ? (
        <Button
          color="primary"
          onClick={() => handleOpenInscripcionDialog(clase)}
          disabled={clase.cuposDisponibles === 0}
          sx={{ mr: 1 }}
        >
          Inscribir Cliente
        </Button>
      ) : userRole === 'CLIENTE' && (
        estaInscrito(clase) ? (
          <Button
            color="error"
            onClick={() => darmedeBaja(clase.id)}
          >
            Darme de baja
          </Button>
        ) : (
          <Button
            color="primary"
            onClick={() => inscribirme(clase.id)}
            disabled={clase.cuposDisponibles === 0}
          >
            Inscribirme
          </Button>
        )
      )}
    </TableCell>
    <TableCell>
      {userRole === 'ADMIN' && (
        <Button
          variant="contained"
          color="error"
          onClick={() => eliminarClase(clase.id)}
          size="small"
        >
          Eliminar
        </Button>
      )}
    </TableCell>
  </TableRow>
))}
    </TableBody>
  </Table>
</TableContainer>

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
<Dialog 
  open={inscripcionDialogOpen} 
  onClose={() => setInscripcionDialogOpen(false)}
>
  <DialogTitle>Inscribir Cliente en Clase</DialogTitle>
  <DialogContent>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    
    {loading ? (
      <Box display="flex" justifyContent="center" m={2}>
        <CircularProgress />
      </Box>
    ) : (
      <FormControl fullWidth margin="normal">
        <InputLabel>Seleccionar Cliente</InputLabel>
        <Select
          value={selectedClienteId}
          onChange={e => setSelectedClienteId(e.target.value)}
          label="Seleccionar Cliente"
        >
          <MenuItem value="" disabled>Seleccionar Cliente</MenuItem>
          {clientes.map(cliente => (
            <MenuItem key={cliente.id} value={cliente.id}>
              {`${cliente.nombre} ${cliente.apellido}`}
            </MenuItem>
          ))}
        </Select>
        {selectedClase && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Clase: {selectedClase.nombre} - {selectedClase.horario}
          </Typography>
        )}
      </FormControl>
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