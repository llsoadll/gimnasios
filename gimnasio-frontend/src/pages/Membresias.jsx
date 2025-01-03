import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Dialog, TextField, FormControl, Select, MenuItem,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Box
} from '@mui/material';
import axios from 'axios';

const Membresias = () => {
  const [membresias, setMembresias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nuevaMembresia, setNuevaMembresia] = useState({
    clienteId: '',
    fechaInicio: '',
    precio: '',
    tipo: 'MENSUAL',
    activa: true
  });

  useEffect(() => {
    fetchMembresias();
    fetchClientes();
  }, []);

  const fetchMembresias = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/membresias');
      setMembresias(response.data);
    } catch (err) {
      setError('Error al cargar membresías. Verifica que el servidor esté funcionando.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/usuarios');
      // Filtra solo los clientes y asegúrate de que sea un array
      const clientesData = Array.isArray(response.data) ? 
        response.data.filter(u => u.tipo === 'CLIENTE') : [];
      setClientes(clientesData);
    } catch (err) {
      console.error('Error:', err);
      setClientes([]); // En caso de error, establece un array vacío
    }
};


  const eliminarMembresia = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta membresía?')) {
        try {
            await axios.delete(`http://localhost:8080/api/membresias/${id}`);
            setMembresias(membresias.filter(membresia => membresia.id !== id));
        } catch (err) {
            setError('Error al eliminar membresía');
        }
    }
};

  const agregarMembresia = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        const response = await axios.post('http://localhost:8080/api/membresias', {
            cliente: {
                id: parseInt(nuevaMembresia.clienteId)  // Asegurarnos que el ID es un número
            },
            fechaInicio: nuevaMembresia.fechaInicio,
            precio: parseFloat(nuevaMembresia.precio),
            tipo: nuevaMembresia.tipo,
            activa: nuevaMembresia.activa
        });
        await fetchMembresias(); // Recargar las membresías después de crear una nueva
        setOpenDialog(false);
    } catch (err) {
        setError(`Error al crear membresía: ${err.response?.data?.message || err.message}`);
        console.error('Error:', err);
    } finally {
        setLoading(false);
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
        Nueva Membresía
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {membresias.map((membresia) => (
              <TableRow key={membresia.id}>
                <TableCell>{membresia.cliente ? `${membresia.cliente.nombre} ${membresia.cliente.apellido}` : 'Sin cliente'}</TableCell>
                <TableCell>{membresia.tipo}</TableCell>
                <TableCell>{membresia.fechaInicio}</TableCell>
                <TableCell>{membresia.fechaFin}</TableCell>
                <TableCell>{membresia.precio}</TableCell>
                <TableCell>{membresia.activa ? 'Activa' : 'Inactiva'}</TableCell>
                <TableCell>
                            <Button 
                                color="error"
                                onClick={() => eliminarMembresia(membresia.id)}
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
        <DialogTitle>Nueva Membresía</DialogTitle>
        <DialogContent>
          <form onSubmit={agregarMembresia}>
            <FormControl fullWidth margin="normal">
              <Select
                value={nuevaMembresia.clienteId}
                onChange={e => setNuevaMembresia({...nuevaMembresia, clienteId: e.target.value})}
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
            <TextField 
              fullWidth
              margin="normal"
              label="Fecha Inicio" 
              type="date"
              InputLabelProps={{ shrink: true }}
              value={nuevaMembresia.fechaInicio}
              onChange={e => setNuevaMembresia({...nuevaMembresia, fechaInicio: e.target.value})}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Precio" 
              type="number"
              value={nuevaMembresia.precio}
              onChange={e => setNuevaMembresia({...nuevaMembresia, precio: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <Select
                value={nuevaMembresia.tipo}
                onChange={e => setNuevaMembresia({...nuevaMembresia, tipo: e.target.value})}
              >
                <MenuItem value="MENSUAL">Mensual</MenuItem>
                <MenuItem value="TRIMESTRAL">Trimestral</MenuItem>
                <MenuItem value="ANUAL">Anual</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Select
                value={nuevaMembresia.activa}
                onChange={e => setNuevaMembresia({...nuevaMembresia, activa: e.target.value})}
              >
                <MenuItem value={true}>Activa</MenuItem>
                <MenuItem value={false}>Inactiva</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={agregarMembresia} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Membresias;