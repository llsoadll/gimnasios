import React, { useState, useEffect, useMemo } from 'react';
import {
  Grid, Paper, Typography, Box, Alert, CircularProgress,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  Divider
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../utils/axios';
import moment from 'moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardCliente = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const userId = localStorage.getItem('userId');

   // Move useMemo hook here, outside any conditional logic
   const membresiaActiva = useMemo(() => {
    if (!data?.membresias?.length) return null;
    
    const membresiasActivas = data.membresias
      .filter(m => m.activa && moment(m.fechaFin).isAfter(moment()))
      .sort((a, b) => moment(b.fechaFin).diff(moment(a.fechaFin)));
    
    return membresiasActivas[0] || null;
  }, [data]);


// Calculate diasParaVencer based on membresiaActiva
  const diasParaVencer = membresiaActiva ? 
    moment(membresiaActiva.fechaFin).diff(moment(), 'days') : 0;

  useEffect(() => {
    fetchDashboardData();
  }, []);


  const tienePagosPendientes = useMemo(() => {
    if (!membresiaActiva || !data?.membresias) return false;
    
    const membresiaCompleta = data.membresias.find(m => m.id === membresiaActiva.id);
    console.log('Membresía completa:', membresiaCompleta);
    console.log('Pagos de la membresía:', membresiaCompleta?.pagos);
    
    // Verificar si la membresía tiene pagos
    const tienePagos = membresiaCompleta?.pagos && membresiaCompleta.pagos.length > 0;
    console.log('¿Tiene pagos?:', tienePagos);
    
    return !tienePagos;
  }, [membresiaActiva, data]);


  const fetchDashboardData = async () => {
    try {
      const response = await api.get(`/usuarios/${userId}/detalle`);
      setData(response.data);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return <Alert severity="info">No hay datos disponibles</Alert>;

  const chartData = {
    labels: data.seguimientos?.map(s => moment(s.fecha).format('DD/MM/YYYY')),
    datasets: [
      {
        label: 'Peso (kg)',
        data: data.seguimientos?.map(s => s.peso),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'IMC',
        data: data.seguimientos?.map(s => s.imc),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };


    return (
        <Grid container spacing={3}>
          {/* Alertas y Notificaciones */}
          <Grid item xs={12}>
            {diasParaVencer <= 7 && membresiaActiva && (
              <Alert severity="warning">
                Tu membresía vence en {diasParaVencer} días
              </Alert>
            )}
            {/* Verificación de pagos pendientes más precisa */}
            {membresiaActiva && tienePagosPendientes && (
  <Alert severity="info" sx={{ mt: 2 }}>
    Tienes pagos pendientes
  </Alert>
)}
          </Grid>

      {/* Membresía Actual */}
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 3, backgroundColor: '#1976d2', color: 'white' }}>
        <Typography variant="h6">Membresía Actual</Typography>
        <Divider sx={{ my: 1, backgroundColor: 'white' }} />
        {membresiaActiva ? (
  <>
    <Typography>Tipo: {membresiaActiva.tipo}</Typography>
    <Typography>
      Vence: {Array.isArray(membresiaActiva.fechaFin) ? 
        moment([membresiaActiva.fechaFin[0], membresiaActiva.fechaFin[1] - 1, membresiaActiva.fechaFin[2]]).format('DD/MM/YYYY') : 
        moment(membresiaActiva.fechaFin).format('DD/MM/YYYY')}
    </Typography>
  </>
) : (
  <Typography>No hay membresía activa</Typography>
)}
      </Paper>
    </Grid>

      {/* Clases Inscritas */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Mis Clases</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Clase</TableCell>
                  <TableCell>Día</TableCell>
                  <TableCell>Horario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.clasesInscritas?.map(clase => (
                  <TableRow key={clase.id}>
                    <TableCell>{clase.nombre}</TableCell>
                    <TableCell>{clase.dia}</TableCell>
                    <TableCell>{clase.horario}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      {/* Rutinas */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Mis Rutinas</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Entrenador</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.rutinas?.map(rutina => (
                  <TableRow key={rutina.id}>
                    <TableCell>{rutina.nombre}</TableCell>
                    <TableCell>{`${rutina.entrenador.nombre} ${rutina.entrenador.apellido}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      {/* Gráfico de Evolución */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Mi Evolución</Typography>
          <Box sx={{ height: 400 }}>
            <Line data={chartData} options={{
              responsive: true,
              maintainAspectRatio: false
            }} />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardCliente;