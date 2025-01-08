import React, { useState, useEffect } from 'react';
import {
  Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, FormControl, 
  Select, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Box, CircularProgress, Typography
} from '@mui/material';
import api from '../utils/axios';
import { Payment } from '@mui/icons-material';

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nuevoPago, setNuevoPago] = useState({
    membresiaId: '',
    fecha: '',
    metodoPago: ''
  });

  useEffect(() => {
    fetchPagos();
    fetchMembresias();
  }, []);

  const fetchPagos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pagos');
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
        const response = await api.get('/membresias/sin-pagar');
        setMembresias(response.data);
    } catch (err) {
        setError('Error al cargar membresías');
        console.error('Error:', err);
    }
};

  const eliminarPago = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este pago?')) {
        try {
            await api.delete(`/pagos/${id}`);
            setPagos(pagos.filter(pago => pago.id !== id));
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.message || 'Error al eliminar el pago');
        }
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/pagos', {
        membresiaId: parseInt(nuevoPago.membresiaId),
        fecha: nuevoPago.fecha,
        metodoPago: nuevoPago.metodoPago
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

      <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>
        Registrar Pago
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid #1976d2', pb: 2 }}>
        <Payment 
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
          Listado de Pagos
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Método de Pago</TableCell>
              <TableCell>Acciones</TableCell> 
            </TableRow>
          </TableHead>
          <TableBody>
            {pagos.map((pago) => (
              <TableRow key={pago.id}>
                <TableCell>{`${pago.clienteNombre} ${pago.clienteApellido}`}</TableCell>
                <TableCell>{pago.fecha}</TableCell>
                <TableCell>{pago.monto}</TableCell>
                <TableCell>{pago.metodoPago}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => eliminarPago(pago.id)}
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
        <DialogTitle>Registrar Pago</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
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
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Pagos;