import React, { useState, useEffect } from 'react';
import {
  Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, FormControl, 
  Select, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Box, CircularProgress, Typography, Grid, Card, CardContent, Chip, InputLabel
} from '@mui/material';
import api from '../utils/axios';
import {
  Payment,
  Person,
  CalendarToday,
  AttachMoney,
  Warning,
  Delete as DeleteIcon
} from '@mui/icons-material';

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itemsPorPagina] = useState(10);
const [paginaActual, setPaginaActual] = useState(1);
  const [nuevoPago, setNuevoPago] = useState({
    membresiaId: '',
    fecha: '',
    metodoPago: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
const [filterMetodoPago, setFilterMetodoPago] = useState('');

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

const pagosFiltrados = pagos.filter(pago => {
  const matchSearch = searchTerm === '' || 
    `${pago.clienteNombre} ${pago.clienteApellido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
      
  const matchMetodoPago = filterMetodoPago === '' || 
    pago.metodoPago === filterMetodoPago;
      
  return matchSearch && matchMetodoPago;
});

// Calcular total de páginas
const totalPaginas = Math.max(1, Math.ceil(pagosFiltrados.length / itemsPorPagina));

// Paginar los resultados
const pagosAPaginar = pagosFiltrados.slice(
  (paginaActual - 1) * itemsPorPagina,
  paginaActual * itemsPorPagina
);



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

<Box sx={{ 
  mb: 2, 
  display: 'flex', 
  flexDirection: { xs: 'column', sm: 'row' }, // Columna en móvil, fila en desktop
  gap: 2,
  alignItems: { xs: 'stretch', sm: 'center' } // Estiran en móvil, centrados en desktop
}}>
  <TextField
    label="Buscar pago"
    variant="outlined"
    size="small"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    sx={{ width: { xs: '100%', sm: 300 } }}
    placeholder="Buscar por nombre de cliente..."
  />
  <FormControl size="small" sx={{ width: { xs: '100%', sm: 200 } }}>
    <InputLabel>Método de Pago</InputLabel>
    <Select
      value={filterMetodoPago}
      onChange={(e) => setFilterMetodoPago(e.target.value)}
      label="Método de Pago"
    >
      <MenuItem value="">Todos</MenuItem>
      <MenuItem value="EFECTIVO">Efectivo</MenuItem>
      <MenuItem value="TARJETA">Tarjeta</MenuItem>
      <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
    </Select>
  </FormControl>
  <Button 
    variant="contained" 
    onClick={() => setOpenDialog(true)}
    sx={{ 
      width: { xs: '100%', sm: 'auto' }, // Ancho completo en móvil, automático en desktop
      alignSelf: { sm: 'flex-start' }
    }}
  >
    Registrar Pago
  </Button>
</Box>

      <Grid container spacing={3}>
      {pagosAPaginar.map((pago) => (
    <Grid item xs={12} sm={6} md={4} key={pago.id}>
      <Card sx={{ 
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 3
        }
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" color="primary">
              ${pago.monto}
            </Typography>
            <Chip 
              label={pago.metodoPago}
              color="info"
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Person sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body1">
              {`${pago.clienteNombre} ${pago.clienteApellido}`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(pago.fecha).toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => eliminarPago(pago.id)}
              startIcon={<DeleteIcon />}
            >
              Eliminar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>


<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
  <Button 
    disabled={paginaActual === 1 || pagosFiltrados.length === 0} 
    onClick={() => setPaginaActual(prev => prev - 1)}
  >
    Anterior
  </Button>
  <Typography sx={{ alignSelf: 'center' }}>
    Página {pagosFiltrados.length === 0 ? 0 : paginaActual} de {pagosFiltrados.length === 0 ? 0 : totalPaginas}
  </Typography>
  <Button 
    disabled={paginaActual === totalPaginas || pagosFiltrados.length === 0} 
    onClick={() => setPaginaActual(prev => prev + 1)}
  >
    Siguiente
  </Button>
</Box>




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