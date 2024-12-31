import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, TextField, FormControl, Select, MenuItem,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Box
} from '@mui/material';
import api from '../utils/axios'; // Ensure this path is correct

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

  useEffect(() => {
    fetchRutinas();
    fetchUsuarios();
  }, []);

  const fetchRutinas = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await api.get('/rutinas');
        console.log('Rutinas cargadas:', response.data); // Debug log
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
        // Recargar tanto rutinas como usuarios
        await Promise.all([
            fetchRutinas(),
            fetchUsuarios()
        ]);
        
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

      <Button 
        variant="contained" 
        onClick={() => setOpenDialog(true)} 
        sx={{ mb: 2 }}
      >
        Nueva Rutina
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Entrenador</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rutinas.map((rutina) => (
              <TableRow key={rutina.id}>
                <TableCell>{rutina.nombre}</TableCell>
                <TableCell>{rutina.descripcion}</TableCell>
                <TableCell>
                  {rutina.cliente ? `${rutina.cliente.nombre} ${rutina.cliente.apellido}` : 'Sin cliente'}
                </TableCell>
                <TableCell>
                  {rutina.entrenador ? `${rutina.entrenador.nombre} ${rutina.entrenador.apellido}` : 'Sin entrenador'}
                </TableCell>
                <TableCell>
                  <Button 
                    color="error"
                    onClick={() => eliminarRutina(rutina.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
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
    </>
  );
};

export default Rutinas;