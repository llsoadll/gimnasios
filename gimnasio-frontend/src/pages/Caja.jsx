import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, Select, MenuItem, TextField, Alert, CircularProgress 
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../utils/axios';
import moment from 'moment'; 
import { AccountBalance } from '@mui/icons-material';

const Caja = () => {
  const [totalDiario, setTotalDiario] = useState(0);
  const [totalMensual, setTotalMensual] = useState(0);
  const [totalAnual, setTotalAnual] = useState(0);
  const [ingresos, setIngresos] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState(moment().format('YYYY-MM-DD'));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTotales();
    fetchIngresos(); 
  }, [filtroFecha]);


  const fetchIngresos = async () => {
    try {
        const fecha = new Date(filtroFecha);
        const primerDiaMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        const ultimoDiaMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

        const response = await api.get('/caja/ingresos', {
            params: {
                inicio: primerDiaMes.toISOString().split('T')[0],
                fin: ultimoDiaMes.toISOString().split('T')[0]
            }
        });

        console.log('Respuesta ingresos:', response.data);

        const ingresosFormateados = response.data.map(ingreso => {
            // Intentar obtener el monto de diferentes fuentes posibles
            const monto = ingreso.monto || 
                         ingreso.pago?.monto || 
                         ingreso.pago?.membresia?.precio || 
                         0;

            const fecha = Array.isArray(ingreso.fecha) ? 
                moment([ingreso.fecha[0], ingreso.fecha[1] - 1, ingreso.fecha[2]]) : 
                moment(ingreso.fecha);

            return {
                fecha: fecha.format('DD/MM/YYYY'),
                monto: parseFloat(monto), // Convertir a número
                cliente: `${ingreso.clienteNombre || ''} ${ingreso.clienteApellido || ''}`.trim(),
                concepto: ingreso.concepto || 'Sin concepto'
            };
        });

        // Ordenar por fecha
        ingresosFormateados.sort((a, b) => moment(a.fecha, 'DD/MM/YYYY') - moment(b.fecha, 'DD/MM/YYYY'));
        
        console.log('Ingresos formateados:', ingresosFormateados);
        setIngresos(ingresosFormateados);
    } catch (err) {
        console.error('Error al cargar ingresos:', err);
    }
};


const fetchTotales = async () => {
  try {
      const fecha = new Date(filtroFecha);
      const anio = fecha.getFullYear();
      const mes = fecha.getMonth() + 1;

      console.log('Fecha filtro:', filtroFecha); // Agregar este log
      
      const respDiaria = await api.get(`/caja/diario?fecha=${filtroFecha}`);
      console.log('Respuesta diaria completa:', respDiaria); // Agregar este log
      
      const respMensual = await api.get(`/caja/mensual?anio=${anio}&mes=${mes}`);
      const respAnual = await api.get(`/caja/anual?anio=${anio}`);

      setTotalDiario(respDiaria.data || 0);
      setTotalMensual(respMensual.data || 0);
      setTotalAnual(respAnual.data || 0);
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



    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
      <Paper sx={{ 
  p: 3,
  mb: 3,
  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
  color: 'white' 
}}>
          <Typography variant="h5" gutterBottom>Total Diario</Typography>
          <Typography variant="h6" gutterBottom>${totalDiario}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
      <Paper sx={{ 
  p: 3,
  mb: 3,
  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
  color: 'white' 
}}>
          <Typography variant="h5" gutterBottom>Total Mensual</Typography>
          <Typography variant="h6" gutterBottom>${totalMensual}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
      <Paper sx={{ 
  p: 3,
  mb: 3,
  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
  color: 'white' 
}}>
          <Typography variant="h5" gutterBottom>Total Anual</Typography>
          <Typography variant="h6" gutterBottom>${totalAnual}</Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
      <Paper sx={{ p: 3, mb: 3 }}>
  <Typography variant="h6" gutterBottom>Gráfico de Ingresos</Typography>
  <Box sx={{ height: '500px', width: '100%', overflow: 'auto' }}>
    <LineChart 
      width={1200} 
      height={400} 
      data={ingresos}
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
    >
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke="rgba(0,0,0,0.1)"
      />
      <XAxis 
        dataKey="fecha" 
        height={60}
        tick={{ fill: '#666', fontSize: 12 }}
        tickMargin={10}
      />
      <YAxis 
        tick={{ fill: '#666', fontSize: 12 }}
        tickFormatter={(value) => `$${value}`}
      />
      <Tooltip 
        contentStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px'
        }}
        formatter={(value) => [`$${value}`, 'Monto']}
        labelFormatter={(label) => `Fecha: ${label}`}
      />
      <Legend 
        verticalAlign="top" 
        height={36}
      />
      <Line 
        type="monotone" 
        dataKey="monto" 
        stroke="#2196f3"
        strokeWidth={3}
        dot={{ 
          r: 6,
          fill: '#fff',
          strokeWidth: 3
        }}
        activeDot={{ 
          r: 8,
          strokeWidth: 0,
          fill: '#2196f3'
        }}
        name="Ingresos"
      />
    </LineChart>
  </Box>
</Paper>
      </Grid>
      </Grid>
    </Box>
  );
};

export default Caja;