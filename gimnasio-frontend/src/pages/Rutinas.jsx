import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, TextField, FormControl, Select, MenuItem,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Box, Typography
} from '@mui/material';
import api from '../utils/axios';
import { 
  SportsGymnastics,
  Edit as EditIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';



const Rutinas = () => {
  const [rutinas, setRutinas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nuevaRutina, setNuevaRutina] = useState({
    nombre: '',
    descripcion: '',
    clienteId: '',
    entrenadorId: ''
  });
  const [editDialog, setEditDialog] = useState(false);
const [rutinaEdit, setRutinaEdit] = useState({
  id: '',
  nombre: '',
  descripcion: '',
  entrenadorId: ''
});

  useEffect(() => {
    fetchRutinas();
    fetchUsuarios();
  }, []);


  // Obtener el rol y ID del usuario actual
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  const fetchRutinas = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (userRole === 'CLIENTE') {
        // Si es cliente, solo obtener sus rutinas
        response = await api.get(`/rutinas/cliente/${userId}`);
      } else {
        // Si es admin o entrenador, obtener todas las rutinas
        response = await api.get('/rutinas');
      }
      const data = Array.isArray(response.data) ? response.data : [];
      setRutinas(data);
    } catch (err) {
      setError('Error al cargar rutinas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setClientes(response.data.filter(u => u.tipo === 'CLIENTE'));
      setEntrenadores(response.data.filter(u => u.tipo === 'ENTRENADOR'));
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error('Error:', err);
    }
  };

  const agregarRutina = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        const rutinaData = {
            nombre: nuevaRutina.nombre,
            descripcion: nuevaRutina.descripcion,
            cliente: { id: parseInt(nuevaRutina.clienteId) },
            entrenador: { id: parseInt(nuevaRutina.entrenadorId) }
        };

        const response = await api.post('/rutinas', rutinaData);
        await fetchRutinas();
        await fetchUsuarios(); // Recargar usuarios después de crear una rutina
        setOpenDialog(false);
        setNuevaRutina({
            nombre: '',
            descripcion: '',
            clienteId: '',
            entrenadorId: ''
        });
    } catch (err) {
        setError(`Error al crear rutina: ${err.response?.data?.message || err.message}`);
        console.error('Error:', err);
    } finally {
        setLoading(false);
    }
};

const handleEditClick = (rutina) => {
  setRutinaEdit({
    id: rutina.id,
    nombre: rutina.nombre,
    descripcion: rutina.descripcion,
    entrenadorId: rutina.entrenador?.id || ''
  });
  setEditDialog(true);
};

const actualizarRutina = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const rutinaData = {
      nombre: rutinaEdit.nombre,
      descripcion: rutinaEdit.descripcion,
      entrenador: { id: parseInt(rutinaEdit.entrenadorId) }
    };
    await api.put(`/rutinas/${rutinaEdit.id}`, rutinaData);
    await fetchRutinas();
    setEditDialog(false);
  } catch (err) {
    setError('Error al actualizar rutina');
  } finally {
    setLoading(false);
  }
};

  const eliminarRutina = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta rutina?')) {
      try {
        await api.delete(`/rutinas/${id}`);
        setRutinas(rutinas.filter(r => r.id !== id));
      } catch (err) {
        setError('Error al eliminar rutina');
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

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box>

<Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid #1976d2', pb: 2 }}>
  <SportsGymnastics 
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
          Listado de Rutinas
        </Typography>
      </Box>

      {userRole === 'ADMIN' && (
      <Button 
        variant="contained" 
        onClick={() => setOpenDialog(true)} 
        sx={{ mb: 2 }}
      >
        Nueva Rutina
      </Button>
      )}



      <TableContainer component={Paper}>
        
      </TableContainer>
    </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
          <TableRow>
  <TableCell>Nombre</TableCell>
  <TableCell>Descripción</TableCell>
  {userRole !== 'CLIENTE' && <TableCell>Cliente</TableCell>}
  <TableCell>Entrenador</TableCell>
  {(userRole === 'ADMIN' || userRole === 'ENTRENADOR') && <TableCell>Acciones</TableCell>}
</TableRow>
          </TableHead>
          <TableBody>
            {rutinas.map((rutina) => (
              <TableRow key={rutina.id}>
                <TableCell>{rutina.nombre}</TableCell>
                <TableCell>{rutina.descripcion}</TableCell>
                {userRole !== 'CLIENTE' && (
                <TableCell>
                  {rutina.cliente ? `${rutina.cliente.nombre} ${rutina.cliente.apellido}` : 'Sin cliente'}
                </TableCell>
                )}
                <TableCell>
                  {rutina.entrenador ? `${rutina.entrenador.nombre} ${rutina.entrenador.apellido}` : 'Sin entrenador'}
                </TableCell>
                {(userRole === 'ADMIN' || userRole === 'ENTRENADOR') && (
  <TableCell>
    <Box sx={{ display: 'flex', gap: 2 }}>
    <Button
  variant="contained"
  color="primary"
  size="small"
  onClick={() => handleEditClick(rutina)}
  startIcon={<EditIcon />}
>
  Editar
</Button>
{userRole === 'ADMIN' && (
  <Button
    variant="contained"
    color="error"
    size="small"
    onClick={() => eliminarRutina(rutina.id)}
    startIcon={<DeleteIcon />}
  >
    Eliminar
  </Button>
)}
    </Box>
  </TableCell>
)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Nueva Rutina</DialogTitle>
        <DialogContent>
          <form onSubmit={agregarRutina}>
            <TextField 
              fullWidth
              margin="normal"
              label="Nombre" 
              value={nuevaRutina.nombre}
              onChange={e => setNuevaRutina({...nuevaRutina, nombre: e.target.value})}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Descripción"
              multiline
              rows={4}
              value={nuevaRutina.descripcion}
              onChange={e => setNuevaRutina({...nuevaRutina, descripcion: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <Select
                value={nuevaRutina.clienteId}
                onChange={e => setNuevaRutina({...nuevaRutina, clienteId: e.target.value})}
                displayEmpty
              >
                <MenuItem value="" disabled>Seleccionar Cliente</MenuItem>
                {clientes.map(cliente => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                    {`${cliente.nombre} ${cliente.apellido}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Select
                value={nuevaRutina.entrenadorId}
                onChange={e => setNuevaRutina({...nuevaRutina, entrenadorId: e.target.value})}
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

<Dialog open={editDialog} onClose={() => setEditDialog(false)}>
  <DialogTitle>Modificar Rutina</DialogTitle>
  <DialogContent>
    <form onSubmit={actualizarRutina}>
      <TextField
        fullWidth
        margin="normal"
        label="Nombre"
        value={rutinaEdit.nombre}
        onChange={e => setRutinaEdit({...rutinaEdit, nombre: e.target.value})}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Descripción"
        multiline
        rows={4}
        value={rutinaEdit.descripcion}
        onChange={e => setRutinaEdit({...rutinaEdit, descripcion: e.target.value})}
      />
      {userRole === 'ADMIN' && (
        <FormControl fullWidth margin="normal">
          <Select
            value={rutinaEdit.entrenadorId}
            onChange={e => setRutinaEdit({...rutinaEdit, entrenadorId: e.target.value})}
          >
            {entrenadores.map(entrenador => (
              <MenuItem key={entrenador.id} value={entrenador.id}>
                {`${entrenador.nombre} ${entrenador.apellido}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <DialogActions>
        <Button onClick={() => setEditDialog(false)}>Cancelar</Button>
        <Button type="submit" variant="contained">Guardar</Button>
      </DialogActions>
    </form>
  </DialogContent>
</Dialog>
    </>
  );
};

export default Rutinas;