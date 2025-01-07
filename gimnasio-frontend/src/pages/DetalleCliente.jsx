import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,       // Add if needed
  TableBody,       // Add if needed
  TableRow,        // Add if needed
  TableCell    
  // ...existing material-ui imports...
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

const DetalleCliente = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatearFecha = (fecha) => {
    // Si la fecha viene como array [año, mes, día]
    if (Array.isArray(fecha)) {
      return moment([fecha[0], fecha[1] - 1, fecha[2]]).format('DD/MM/YYYY');
    }
    // Si la fecha viene como string
    return moment(fecha).format('DD/MM/YYYY');
  };

  useEffect(() => {
    fetchClienteDetalle();
  }, [id]);

  const fetchClienteDetalle = async () => {
    try {
      const response = await api.get(`/usuarios/${id}/detalle`);
      setCliente(response.data);
    } catch (err) {
      setError('Error al cargar detalles del cliente');
    } finally {
      setLoading(false);
    }
  };


  const chartData = {
    labels: cliente?.seguimientos?.map(s => {
      const fecha = new Date(s.fecha);
      return fecha.toLocaleDateString('es-AR');
    }) || [],
    datasets: [
      {
        label: 'Peso (kg)',
        data: cliente?.seguimientos?.map(s => s.peso) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'IMC',
        data: cliente?.seguimientos?.map(s => s.imc) || [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          title: function(tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      },
      legend: {
        position: 'top',
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Valor'
        }
      }
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!cliente) return <Alert severity="info">Cliente no encontrado</Alert>;

  return (
    <Grid container spacing={3}>
      {/* Información Personal */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Información Personal</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>Nombre: {cliente.nombre} {cliente.apellido}</Typography>
              <Typography>Email: {cliente.email}</Typography>
              <Typography>Teléfono: {cliente.telefono}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Estado: {cliente.activo ? 'Activo' : 'Inactivo'}</Typography>
              <Typography>Fecha de Nacimiento: {moment(cliente.fechaNacimiento).format('DD/MM/YYYY')}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Membresía Actual */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Membresía Actual</Typography>
          <Divider sx={{ my: 2 }} />
          {cliente.membresias?.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Fecha Inicio</TableCell>
                    <TableCell>Fecha Fin</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cliente.membresias.map(membresia => (
                    <TableRow key={membresia.id}>
                    <TableCell>{membresia.tipo}</TableCell>
                    <TableCell>{formatearFecha(membresia.fechaInicio)}</TableCell>
                    <TableCell>{formatearFecha(membresia.fechaFin)}</TableCell>
                    <TableCell>{membresia.activa ? 'Activa' : 'Inactiva'}</TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No hay membresías registradas</Typography>
          )}
        </Paper>
      </Grid>

      {/* Historial de Pagos */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Historial de Pagos</Typography>
          <Divider sx={{ my: 2 }} />
          {cliente.pagos?.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Método</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {cliente.pagos.map(pago => (
              <TableRow key={pago.id}>
                <TableCell>{formatearFecha(pago.fecha)}</TableCell>
                <TableCell>${pago.monto}</TableCell>
                <TableCell>{pago.metodoPago}</TableCell>
              </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No hay pagos registrados</Typography>
          )}
        </Paper>
      </Grid>

      {/* Rutinas Asignadas */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Rutinas Asignadas</Typography>
          <Divider sx={{ my: 2 }} />
          {cliente.rutinas?.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Entrenador</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cliente.rutinas.map(rutina => (
                    <TableRow key={rutina.id}>
                      <TableCell>{rutina.nombre}</TableCell>
                      <TableCell>{rutina.descripcion}</TableCell>
                      <TableCell>{`${rutina.entrenador.nombre} ${rutina.entrenador.apellido}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No hay rutinas asignadas</Typography>
          )}
        </Paper>
      </Grid>

      {/* Clases Inscritas */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Clases Inscritas</Typography>
          <Divider sx={{ my: 2 }} />
          {cliente.clasesInscritas?.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Día</TableCell>
                    <TableCell>Horario</TableCell>
                    <TableCell>Entrenador</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cliente.clasesInscritas.map(clase => (
                    <TableRow key={clase.id}>
                      <TableCell>{clase.nombre}</TableCell>
                      <TableCell>{clase.dia}</TableCell>
                      <TableCell>{clase.horario}</TableCell>
                      <TableCell>
                        {clase.entrenador ? 
                          `${clase.entrenador.nombre} ${clase.entrenador.apellido}` : 
                          'Sin entrenador'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No está inscrito en ninguna clase</Typography>
          )}
        </Paper>
      </Grid>
      {/* Seguimiento */}
      <Grid item xs={12}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Seguimiento</Typography>
        <Divider sx={{ my: 2 }} />
        {cliente?.seguimientos?.length > 0 ? (
      <Box sx={{ height: 300, mt: 3 }}>
        <Typography variant="h6">Progreso</Typography>
        <Line data={chartData} options={chartOptions} />
      </Box>
    ) : (
      <Typography>No hay seguimientos registrados</Typography>
    )}
      </Paper>
    </Grid>
    </Grid>
  );
};

export default DetalleCliente;