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
import api from '../utils/axios';

const Clases = () => {
  const [clases, setClases] = useState([]);
  const handleOpenInscripcionDialog = (clase) => {
    setSelectedClase(clase);
    fetchClientes(); // Cargar clientes antes de abrir el diálogo
    setInscripcionDialogOpen(true);
  };
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

const darDeBajaInscripcion = async (inscripcionId) => {
  if (window.confirm('¿Está seguro de dar de baja esta inscripción?')) {
    try {
      await api.post(`/clases/inscripciones/${inscripcionId}/cancelar`);
      await fetchClases(); // Recargar las clases para actualizar la lista
    } catch (err) {
      setError('Error al dar de baja la inscripción');
      console.error('Error:', err);
    }
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
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Button 
        variant="contained" 
        onClick={() => setOpenDialog(true)} 
        sx={{ mb: 2 }}
      >
        Nueva Clase
      </Button>

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
        <TableCell>Alumnos Inscriptos</TableCell>
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
          <TableCell>{clase.cupo}</TableCell>
          <TableCell>{clase.cuposDisponibles}</TableCell>
          <TableCell>
            {clase.entrenador ? `${clase.entrenador.nombre} ${clase.entrenador.apellido}` : 'Sin entrenador'}
          </TableCell>
          <TableCell>
  {clase.clientesInscritos?.length > 0 ? (
    <ul style={{ margin: 0, paddingInlineStart: '20px' }}>
      {clase.clientesInscritos.map(cliente => (
        <li key={cliente.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {`${cliente.nombre} ${cliente.apellido}`}
          <Button 
            size="small" 
            color="error"
            onClick={() => darDeBajaInscripcion(cliente.inscripcionId)}
          >
            Dar de baja
          </Button>
        </li>
      ))}
    </ul>
  ) : (
    'Sin alumnos'
  )}
</TableCell>
          <TableCell>
            <Button
              color="primary"
              onClick={() => handleOpenInscripcionDialog(clase)}
              disabled={clase.cuposDisponibles === 0}
            >
              Inscribir Cliente
            </Button>
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