import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, 
  FormControl, Select, MenuItem, TextField, Alert, CircularProgress, InputLabel  
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../utils/axios';
import moment from 'moment'; 
import { AccountBalance, AttachMoney } from '@mui/icons-material';

const Caja = () => {
  const [totalDiario, setTotalDiario] = useState(0);
  const [totalMensual, setTotalMensual] = useState(0);
  const [totalAnual, setTotalAnual] = useState(0);
  const [ingresos, setIngresos] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState(moment().format('YYYY-MM-DD'));
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState('dia');
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    fetchTotales();
    fetchIngresos();
  }, [filtroFecha, periodo]);


  const fetchIngresos = async () => {
    try {
      let inicio, fin;
      
      switch(periodo) {
        case 'dia':
          inicio = moment(filtroFecha).format('YYYY-MM-DD');
          fin = moment(filtroFecha).format('YYYY-MM-DD');
          break;
        
        case 'mes':
          inicio = moment(filtroFecha).startOf('month').format('YYYY-MM-DD');
          fin = moment(filtroFecha).endOf('month').format('YYYY-MM-DD');
          break;
        
          case 'año':
    inicio = moment(filtroFecha).startOf('year').format('YYYY-MM-DD');
    fin = moment(filtroFecha).endOf('year').format('YYYY-MM-DD');
    
    const anioSeleccionado = moment(filtroFecha).year();
    console.log('Consultando total para año:', anioSeleccionado);
    const respAnual = await api.get(`/caja/anual?anio=${anioSeleccionado}`);
    setTotalDiario(0);
    setTotalMensual(0);
    setTotalAnual(respAnual.data || 0);
    break;
      }
  
      console.log('Consultando ingresos:', { inicio, fin, periodo });
      
      const response = await api.get('/caja/ingresos', {
        params: { inicio, fin }
      });
  
      const ingresosFormateados = response.data.map(ingreso => ({
        fecha: moment(ingreso.fecha).format('DD/MM/YYYY'),
        monto: parseFloat(ingreso.monto || 0),
        cliente: `${ingreso.clienteNombre || ''} ${ingreso.clienteApellido || ''}`.trim(),
        concepto: ingreso.concepto || 'Sin concepto'
      }));
  
      setIngresos(ingresosFormateados);
    } catch (err) {
      console.error('Error al cargar ingresos:', err);
      setError('Error al cargar ingresos');
    }
  };


  const fetchTotales = async () => {
    try {
      const fecha = moment(filtroFecha);
      const anio = fecha.year();
      const mes = fecha.month() + 1;
  
      console.log('Consultando totales:', { periodo, anio, mes, filtroFecha });
  
      switch(periodo) {
        case 'dia':
          const respDiaria = await api.get(`/caja/diario?fecha=${fecha.format('YYYY-MM-DD')}`);
          setTotalDiario(respDiaria.data || 0);
          setTotalMensual(0);
          setTotalAnual(0);
          break;
        case 'mes':
          const mesFormateado = String(mes).padStart(2, '0');
          const respMensual = await api.get(`/caja/mensual?anio=${anio}&mes=${mesFormateado}`);
          setTotalDiario(0);
          setTotalMensual(respMensual.data || 0);
          setTotalAnual(0);
          break;
        case 'año':
          const respAnual = await api.get(`/caja/anual?anio=${anio}`);
          setTotalDiario(0);
          setTotalMensual(0);
          setTotalAnual(respAnual.data || 0);
          break;
      }
    } catch (err) {
      console.error('Error al cargar totales:', err);
    }
  };

return (
  <Box>
    {error && <Alert severity="error">{error}</Alert>}

    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid #1976d2', pb: 2 }}>
      <AccountBalance 
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
        Gestión de Caja
      </Typography>
    </Box>

    <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
  <FormControl size="small" sx={{ minWidth: 200 }}>
    <InputLabel>Período</InputLabel>
    <Select
      value={periodo}
      onChange={(e) => setPeriodo(e.target.value)}
      label="Período"
    >
      <MenuItem value="dia">Diario</MenuItem>
      <MenuItem value="mes">Mensual</MenuItem>
      <MenuItem value="año">Anual</MenuItem>
    </Select>
  </FormControl>

  {periodo === 'dia' && (
    <TextField
      label="Seleccionar Día"
      type="date"
      value={filtroFecha}
      onChange={(e) => setFiltroFecha(e.target.value)}
      InputLabelProps={{ shrink: true }}
      sx={{ width: 200 }}
    />
  )}
  
  {periodo === 'mes' && (
    <TextField
      label="Seleccionar Mes"
      type="month"
      value={filtroFecha.substring(0, 7)}
      onChange={(e) => setFiltroFecha(`${e.target.value}-01`)}
      InputLabelProps={{ shrink: true }}
      sx={{ width: 200 }}
    />
  )}
  
  {periodo === 'año' && (
  <TextField
    label="Seleccionar Año"
    type="number"
    value={moment(filtroFecha).year()}
    onChange={(e) => {
      const year = e.target.value;
      console.log('Año seleccionado:', year);
      setFiltroFecha(moment(`${year}-01-01`).format('YYYY-MM-DD'));
    }}
    InputProps={{ 
      inputProps: { 
        min: 2000, 
        max: 2100
      }
    }}
    sx={{ width: 200 }}
  />
)}
</Box>

<Grid container spacing={3}>
  {periodo === 'dia' && (
    <Grid item xs={12} md={12}>
      <Paper sx={{ 
        p: 3,
        background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
        color: 'white',
        borderRadius: 2,
        boxShadow: 3,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)'
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachMoney sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5">Total Diario</Typography>
        </Box>
        <Typography variant="h4">${totalDiario}</Typography>
      </Paper>
    </Grid>
  )}
  
  {periodo === 'mes' && (
    <Grid item xs={12} md={12}>
      <Paper sx={{ 
        p: 3,
        background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
        color: 'white',
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachMoney sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5">Total Mensual</Typography>
        </Box>
        <Typography variant="h4">${totalMensual}</Typography>
      </Paper>
    </Grid>
  )}
  
  {periodo === 'año' && (
    <Grid item xs={12} md={12}>
      <Paper sx={{ 
        p: 3,
        background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
        color: 'white',
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachMoney sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h5">Total Anual</Typography>
        </Box>
        <Typography variant="h4">${totalAnual}</Typography>
      </Paper>
    </Grid>
  )}
      
      <Grid item xs={12}>
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" gutterBottom>Detalle de Ingresos</Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Concepto</TableCell>
            <TableCell align="right">Monto</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ingresos.map((ingreso, index) => (
            <TableRow key={index}>
              <TableCell>{ingreso.fecha}</TableCell>
              <TableCell>{ingreso.cliente}</TableCell>
              <TableCell>{ingreso.concepto}</TableCell>
              <TableCell align="right">${ingreso.monto}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}><strong>Total</strong></TableCell>
            <TableCell align="right">
              <strong>${ingresos.reduce((sum, i) => sum + i.monto, 0).toFixed(2)}</strong>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  </Paper>
</Grid>
      </Grid>
    </Box>
  );
};

export default Caja;