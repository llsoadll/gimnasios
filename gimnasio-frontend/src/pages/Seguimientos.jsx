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
    clienteId: '',
    fecha: new Date().toISOString().split('T')[0],
    peso: '',
    altura: '',
    imc: '',
    observaciones: ''
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (selectedCliente) {
      fetchSeguimientos(selectedCliente);
    }
  }, [selectedCliente]);

  const fetchClientes = async () => {
    try {
      const response = await api.get('/usuarios');
      setClientes(response.data.filter(u => u.tipo === 'CLIENTE'));
    } catch (err) {
      setError('Error al cargar clientes');
      console.error('Error:', err);
    }
  };

  const fetchSeguimientos = async (clienteId) => {
    setLoading(true);
    try {
      const response = await api.get(`/seguimientos/cliente/${clienteId}`);
      setSeguimientos(response.data);
    } catch (err) {
      setError('Error al cargar seguimientos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calcularIMC = (peso, altura) => {
    if (peso && altura) {
      const alturaMetros = altura / 100;
      return (peso / (alturaMetros * alturaMetros)).toFixed(2);
    }
    return '';
  };

  const handlePesoAltura = (e, field) => {
    const value = e.target.value;
    const updates = { ...nuevoSeguimiento, [field]: value };
    
    if (updates.peso && updates.altura) {
      updates.imc = calcularIMC(parseFloat(updates.peso), parseFloat(updates.altura));
    }
    
    setNuevoSeguimiento(updates);
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
          sx={{ mb: 2 }}
        >
          Nuevo Seguimiento
        </Button>
      )}

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
    </>
  );
};

export default Seguimientos;