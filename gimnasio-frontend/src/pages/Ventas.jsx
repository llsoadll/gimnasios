import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Alert, CircularProgress, TextField, FormControl, Select, MenuItem, Button, InputLabel
} from '@mui/material';
import { LocalMall, ShoppingCart } from '@mui/icons-material';
import api from '../utils/axios';
import moment from 'moment';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
const [filterMetodoPago, setFilterMetodoPago] = useState('');
const [itemsPorPagina] = useState(10);
const [paginaActual, setPaginaActual] = useState(1);
  

const ventasFiltradas = ventas.filter(venta => {
  const matchSearch = searchTerm === '' || 
    venta.producto?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${venta.cliente?.nombre} ${venta.cliente?.apellido}`.toLowerCase().includes(searchTerm.toLowerCase());
    
  const matchMetodoPago = filterMetodoPago === '' || 
    venta.metodoPago === filterMetodoPago;
    
  return matchSearch && matchMetodoPago;
})
.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

const totalPaginas = Math.ceil(ventas.length / itemsPorPagina);


  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      try {
        const response = await api.get('/ventas');
        console.log('Ventas recibidas:', response.data);
        console.log('Formato de fecha recibido:', response.data[0]?.fecha); // Ver el formato
        if (!response.data) {
          throw new Error('No se recibieron datos');
        }
        setVentas(response.data);
        setError(null);
      } catch (err) {
        console.error('Error detallado:', err);
        setError('Error al cargar las ventas: ' + (err.response?.data?.message || err.message));
        setVentas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>

<Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid #1976d2', pb: 2 }}>
  <ShoppingCart 
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
    Listado de Ventas
  </Typography>
</Box>


<Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
  <TextField
    label="Buscar venta"
    variant="outlined"
    size="small"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    sx={{ width: { xs: '100%', sm: 300 } }}
    placeholder="Buscar por producto o cliente..."
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
</Box>

      {ventas.length === 0 ? (
        <Alert severity="info">No hay ventas registradas</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio Unitario</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Método de Pago</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {ventasFiltradas.map(venta => (
                <TableRow key={venta.id}>
                  <TableCell>
  {venta.fecha ? moment(venta.fecha).format('DD/MM/YYYY HH:mm') : 'N/A'}
</TableCell>
                  <TableCell>{venta.producto?.nombre || 'N/A'}</TableCell>
                  <TableCell>
                    {venta.cliente ? `${venta.cliente.nombre} ${venta.cliente.apellido}` : 'N/A'}
                  </TableCell>
                  <TableCell>{venta.cantidad}</TableCell>
                  <TableCell>${venta.precioUnitario}</TableCell>
                  <TableCell>${venta.total}</TableCell>
                  <TableCell>{venta.metodoPago}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
  <Button 
    disabled={paginaActual === 1} 
    onClick={() => setPaginaActual(prev => prev - 1)}
  >
    Anterior
  </Button>
  <Typography sx={{ alignSelf: 'center' }}>
    Página {paginaActual} de {totalPaginas}
  </Typography>
  <Button 
    disabled={paginaActual === totalPaginas} 
    onClick={() => setPaginaActual(prev => prev + 1)}
  >
    Siguiente
  </Button>
</Box>
        </TableContainer>
      )}
    </>
  );
};

export default Ventas;