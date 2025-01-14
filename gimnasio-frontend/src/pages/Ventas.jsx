import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Alert, CircularProgress
} from '@mui/material';
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