import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, Select, MenuItem, TextField
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../utils/axios';
import moment from 'moment'; 

const Caja = () => {
  const [totalDiario, setTotalDiario] = useState(0);
  const [totalMensual, setTotalMensual] = useState(0);
  const [totalAnual, setTotalAnual] = useState(0);
  const [ingresos, setIngresos] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState(moment().format('YYYY-MM-DD'));

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
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Gráfico de Ingresos</Typography>
          <LineChart width={800} height={400} data={ingresos}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
        dataKey="fecha" 
        angle={0}
        textAnchor="end"
        height={60}
    />
    <YAxis />
    <Tooltip 
        formatter={(value) => `$${value}`}
        labelFormatter={(label) => `Fecha: ${label}`}
    />
    <Legend />
    <Line 
        type="monotone" 
        dataKey="monto" 
        stroke="#8884d8" 
        name="Monto ($)"
        dot={{ r: 4 }}
    />
</LineChart>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Caja;