import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box
} from '@mui/material';
import api from '../utils/axios';
import moment from 'moment';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await api.get('/api/ventas');
        console.log('Ventas recibidas:', response.data); // Para debug
        setVentas(response.data);
      } catch (err) {
        console.error('Error al cargar ventas:', err);
      }
    };
    fetchVentas();
}, []);

  return (
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
              <TableCell>{venta.producto.nombre}</TableCell>
              <TableCell>{`${venta.cliente.nombre} ${venta.cliente.apellido}`}</TableCell>
              <TableCell>{venta.cantidad}</TableCell>
              <TableCell>${venta.precioUnitario}</TableCell>
              <TableCell>${venta.total}</TableCell>
              <TableCell>{venta.metodoPago}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Ventas;