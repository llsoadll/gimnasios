import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Alert, CircularProgress
} from '@mui/material';
import { LocalMall, ShoppingCart } from '@mui/icons-material';
import api from '../utils/axios';
import moment from 'moment';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      try {
        const response = await api.get('/ventas');
        console.log('Ventas recibidas:', response.data);
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
              {ventas.map(venta => (
                <TableRow key={venta.id}>
                  <TableCell>{moment(venta.fecha).format('DD/MM/YYYY HH:mm')}</TableCell>
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
        </TableContainer>
      )}
    </>
  );
};

export default Ventas;