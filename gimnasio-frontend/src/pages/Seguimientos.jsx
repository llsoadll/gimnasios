import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, TextField, FormControl, Select, MenuItem,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Box, Grid
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../utils/axios';

const Seguimientos = () => {
  const [seguimientos, setSeguimientos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nuevoSeguimiento, setNuevoSeguimiento] = useState({
    fecha: new Date().toISOString().split('T')[0],
    peso: '',
    altura: '',
    imc: '',
    observaciones: ''
  });
  
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userRole === 'ADMIN') {
      fetchClientes();
    } else if (userRole === 'CLIENTE') {
      fetchSeguimientos(userId);
    }
  }, [userRole, userId]);

  const fetchClientes = async () => {
    try {
      const response = await api.get('/usuarios/clientes');
      setClientes(response.data);
    } catch (err) {
      setError('Error al cargar clientes');
    }
  };

  const fetchSeguimientos = async (clienteId) => {
    try {
      const response = await api.get(`/seguimientos/cliente/${clienteId}`);
      setSeguimientos(response.data);
    } catch (err) {
      setError('Error al cargar seguimientos');
    }
  };

  useEffect(() => {
    if (selectedCliente && userRole === 'ADMIN') {
      fetchSeguimientos(selectedCliente);
    }
  }, [selectedCliente]);

  const calcularIMC = (peso, altura) => {
    if (peso && altura) {
      const alturaMetros = altura / 100;
      return (peso / (alturaMetros * alturaMetros)).toFixed(2);
    }
    return '';
  };

  const handlePesoAltura = (e, field) => {
    const value = e.target.value;
    setNuevoSeguimiento(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'peso' || field === 'altura') {
        if (updated.peso && updated.altura) {
          updated.imc = calcularIMC(updated.peso, updated.altura);
        }
      }
      return updated;
    });
  };

  const agregarSeguimiento = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const seguimientoData = {
        cliente: { id: parseInt(selectedCliente) },
        fecha: nuevoSeguimiento.fecha,
        peso: parseFloat(nuevoSeguimiento.peso),
        altura: parseFloat(nuevoSeguimiento.altura),
        imc: parseFloat(nuevoSeguimiento.imc),
        observaciones: nuevoSeguimiento.observaciones
      };

      await api.post('/seguimientos', seguimientoData);
      await fetchSeguimientos(selectedCliente);
      setOpenDialog(false);
      setNuevoSeguimiento({
        clienteId: '',
        fecha: new Date().toISOString().split('T')[0],
        peso: '',
        altura: '',
        imc: '',
        observaciones: ''
      });
    } catch (err) {
      setError(`Error al crear seguimiento: ${err.response?.data?.message || err.message}`);
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
  
      {/* Admin view */}
      {userRole === 'ADMIN' && (
        <Box mb={2}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
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

          {selectedCliente && (
            <Button 
              variant="contained" 
              onClick={() => setOpenDialog(true)}
            >
              Nuevo Seguimiento
            </Button>
          )}
        </Box>
      )}

      {/* Seguimientos table and chart - visible for both ADMIN and CLIENTE */}
      {seguimientos.length > 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Peso (kg)</TableCell>
                    <TableCell>Altura (cm)</TableCell>
                    <TableCell>IMC</TableCell>
                    <TableCell>Observaciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seguimientos.map((seguimiento) => (
                    <TableRow key={seguimiento.id}>
                      <TableCell>{seguimiento.fecha}</TableCell>
                      <TableCell>{seguimiento.peso}</TableCell>
                      <TableCell>{seguimiento.altura}</TableCell>
                      <TableCell>{seguimiento.imc}</TableCell>
                      <TableCell>{seguimiento.observaciones}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <LineChart width={800} height={400} data={seguimientos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="peso" stroke="#8884d8" name="Peso (kg)" />
              <Line yAxisId="right" type="monotone" dataKey="imc" stroke="#82ca9d" name="IMC" />
            </LineChart>
          </Grid>
        </Grid>
      )}

      {userRole === 'ADMIN' && (
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Nuevo Seguimiento</DialogTitle>
        <DialogContent>
          <form onSubmit={agregarSeguimiento}>
            <TextField 
              fullWidth
              margin="normal"
              label="Fecha"
              type="date"
              value={nuevoSeguimiento.fecha}
              onChange={(e) => setNuevoSeguimiento({...nuevoSeguimiento, fecha: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Peso (kg)"
              type="number"
              value={nuevoSeguimiento.peso}
              onChange={(e) => handlePesoAltura(e, 'peso')}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Altura (cm)"
              type="number"
              value={nuevoSeguimiento.altura}
              onChange={(e) => handlePesoAltura(e, 'altura')}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="IMC"
              type="number"
              value={nuevoSeguimiento.imc}
              InputProps={{ readOnly: true }}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Observaciones"
              multiline
              rows={4}
              value={nuevoSeguimiento.observaciones}
              onChange={(e) => setNuevoSeguimiento({...nuevoSeguimiento, observaciones: e.target.value})}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={agregarSeguimiento} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      )}
    </>
  );
};

export default Seguimientos;