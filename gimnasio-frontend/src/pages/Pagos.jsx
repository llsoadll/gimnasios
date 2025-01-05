import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, TextField, FormControl, Select, MenuItem,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Box
} from '@mui/material';
import axios from 'axios';

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nuevoPago, setNuevoPago] = useState({
    membresiaId: '',
    fecha: '',
    monto: '',
    metodoPago: ''
  });

  useEffect(() => {
    fetchPagos();
    fetchMembresias();
  }, []);

  const fetchPagos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/pagos');
      setPagos(response.data);
    } catch (err) {
      setError('Error al cargar pagos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembresias = async () => {
    try {
        // Cambiar el endpoint para obtener solo membresías sin pagar
        const response = await axios.get('http://localhost:8080/api/membresias/sin-pagar');
        setMembresias(response.data);
    } catch (err) {
        setError('Error al cargar membresías');
        console.error('Error:', err);
    }
};

const registrarPago = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axios.post('http://localhost:8080/api/pagos', {
      membresiaId: parseInt(nuevoPago.membresiaId),
      fecha: nuevoPago.fecha,
      metodoPago: nuevoPago.metodoPago
      // Ya no enviamos el monto, se tomará de la membresía
    });
    
    await fetchPagos();
    setOpenDialog(false);
    setNuevoPago({
      membresiaId: '',
      fecha: '',
      metodoPago: ''
    });
  } catch (err) {
    setError('Error al registrar pago');
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
        Registrar Pago
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Método de Pago</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagos.map((pago) => (
              <TableRow key={pago.id}>
                <TableCell>{`${pago.clienteNombre} ${pago.clienteApellido}`}</TableCell>
                <TableCell>{pago.fecha}</TableCell>
                <TableCell>{pago.monto}</TableCell>
                <TableCell>{pago.metodoPago}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Registrar Pago</DialogTitle>
        <DialogContent>
  <form onSubmit={registrarPago}>
    <FormControl fullWidth margin="normal">
      <Select
        value={nuevoPago.membresiaId}
        onChange={e => setNuevoPago({...nuevoPago, membresiaId: e.target.value})}
      >
        <MenuItem value="" disabled>Seleccionar Membresía</MenuItem>
        {membresias.map(membresia => (
          <MenuItem key={membresia.id} value={membresia.id}>
            {`${membresia.cliente.nombre} ${membresia.cliente.apellido} - ${membresia.tipo} - $${membresia.precio}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField 
      fullWidth
      margin="normal"
      label="Fecha" 
      type="date"
      InputLabelProps={{ shrink: true }}
      value={nuevoPago.fecha}
      onChange={e => setNuevoPago({...nuevoPago, fecha: e.target.value})}
    />
    <FormControl fullWidth margin="normal">
      <Select
        value={nuevoPago.metodoPago}
        onChange={e => setNuevoPago({...nuevoPago, metodoPago: e.target.value})}
      >
        <MenuItem value="EFECTIVO">Efectivo</MenuItem>
        <MenuItem value="TARJETA">Tarjeta</MenuItem>
        <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
      </Select>
    </FormControl>
  </form>
</DialogContent>
<DialogActions>
  <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
  <Button 
    onClick={registrarPago} 
    color="primary" 
    disabled={loading}
  >
    {loading ? 'Guardando...' : 'Guardar'}
  </Button>
</DialogActions>
      </Dialog>
    </>
  );
};

export default Pagos;