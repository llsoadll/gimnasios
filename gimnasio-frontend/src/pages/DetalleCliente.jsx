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
    labels: cliente?.seguimientos?.map(s => moment(s.fecha).format('DD/MM/YYYY')),
    datasets: [
      {
        label: 'Peso (kg)',
        data: cliente?.seguimientos?.map(s => s.peso),
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#2196f3',
        pointHoverBackgroundColor: '#2196f3',
        pointHoverBorderColor: '#fff',
        order: 2
      },
      {
        label: 'IMC',
        data: cliente?.seguimientos?.map(s => s.imc),
        borderColor: '#f50057',
        backgroundColor: 'rgba(245, 0, 87, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#f50057',
        pointHoverBackgroundColor: '#f50057',
        pointHoverBorderColor: '#fff',
        order: 1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          title: (tooltipItems) => {
            return `Fecha: ${tooltipItems[0].label}`;
          },
          label: (context) => {
            return ` ${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          font: {
            size: 14,
            weight: 'bold'
          }
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
      <Paper sx={{ 
  p: 3,
  mb: 3,
  backgroundColor: 'white',
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  borderRadius: '12px',
  '& .MuiTableCell-root': { // Estilo para las celdas de la tabla
    borderColor: 'rgba(0,0,0,0.1)',
  },
  '& .MuiTypography-root': { // Estilo para los textos
    color: 'text.primary'
  },
  '& .title': { // Estilo para el título
    borderBottom: '2px solid #1976d2',
    paddingBottom: 1,
    marginBottom: 2,
    color: '#1976d2',
    fontWeight: 600
  }
}}>
  <Typography className="title" variant="h5" gutterBottom>
    Información Personal
  </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>Nombre: {cliente.nombre} {cliente.apellido}</Typography>
              <Typography>Email: {cliente.email}</Typography>
              <Typography>Teléfono: {cliente.telefono}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Estado: {cliente.activo ? 'Activo' : 'Inactivo'}</Typography>
              <Typography>
  Fecha de Nacimiento: {formatearFecha(cliente.fechaNacimiento)}
</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Membresía Actual */}
      <Grid item xs={12} md={6}>
      <Paper sx={{ 
  p: 3,
  mb: 3,
  backgroundColor: 'white',
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  borderRadius: '12px',
  '& .MuiTableCell-root': { // Estilo para las celdas de la tabla
    borderColor: 'rgba(0,0,0,0.1)',
  },
  '& .MuiTypography-root': { // Estilo para los textos
    color: 'text.primary'
  },
  '& .title': { // Estilo para el título
    borderBottom: '2px solid #1976d2',
    paddingBottom: 1,
    marginBottom: 2,
    color: '#1976d2',
    fontWeight: 600
  }
}}>
  <Typography className="title" variant="h5" gutterBottom>
    Membresía Actual 
  </Typography>
          <Divider sx={{ my: 2 }} />
          {cliente.membresias?.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                  <TableCell>
  <Typography sx={{ color: 'white' }}>
    Tipo
  </Typography>
</TableCell>
<TableCell>
  <Typography sx={{ color: 'white' }}>
    Fecha Inicio
  </Typography>
</TableCell>
<TableCell>
  <Typography sx={{ color: 'white' }}>
    Fecha Fin
  </Typography>
</TableCell>
<TableCell>
  <Typography sx={{ color: 'white' }}>
    Estado
  </Typography>
</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cliente.membresias.map(membresia => (
                    <TableRow key={membresia.id}>
                    <TableCell><Typography sx={{ color: 'white' }}>{membresia.tipo}</Typography></TableCell>
                    <TableCell><Typography sx={{ color: 'white' }}>{formatearFecha(membresia.fechaInicio)}</Typography></TableCell>
                    <TableCell><Typography sx={{ color: 'white' }}>{formatearFecha(membresia.fechaFin)}</Typography></TableCell>
                    <TableCell><Typography sx={{ color: 'white' }}>{membresia.activa ? 'Activa' : 'Inactiva'}</Typography></TableCell>
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
      <Paper sx={{ 
  p: 3,
  mb: 3,
  backgroundColor: 'white',
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  borderRadius: '12px',
  '& .MuiTableCell-root': { // Estilo para las celdas de la tabla
    borderColor: 'rgba(0,0,0,0.1)',
  },
  '& .MuiTypography-root': { // Estilo para los textos
    color: 'text.primary'
  },
  '& .title': { // Estilo para el título
    borderBottom: '2px solid #1976d2',
    paddingBottom: 1,
    marginBottom: 2,
    color: '#1976d2',
    fontWeight: 600
  }
}}>
  <Typography className="title" variant="h5" gutterBottom>
    Historial de Pagos
  </Typography>
          <Divider sx={{ my: 2 }} />
          {cliente.pagos?.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography sx={{ color: 'white' }}>Fecha</Typography></TableCell>
                    <TableCell><Typography sx={{ color: 'white' }}>Monto</Typography></TableCell>
                    <TableCell><Typography sx={{ color: 'white' }}>Método</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {cliente.pagos.map(pago => (
              <TableRow key={pago.id}>
                <TableCell><Typography sx={{ color: 'white' }}>{formatearFecha(pago.fecha)}</Typography></TableCell>
                <TableCell><Typography sx={{ color: 'white' }}>${pago.monto}</Typography></TableCell>
                <TableCell><Typography sx={{ color: 'white' }}>{pago.metodoPago}</Typography></TableCell>
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
      <Paper sx={{ 
  p: 3,
  mb: 3,
  backgroundColor: 'white',
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  borderRadius: '12px',
  '& .MuiTableCell-root': { // Estilo para las celdas de la tabla
    borderColor: 'rgba(0,0,0,0.1)',
  },
  '& .MuiTypography-root': { // Estilo para los textos
    color: 'text.primary'
  },
  '& .title': { // Estilo para el título
    borderBottom: '2px solid #1976d2',
    paddingBottom: 1,
    marginBottom: 2,
    color: '#1976d2',
    fontWeight: 600
  }
}}>
  <Typography className="title" variant="h5" gutterBottom>
    Rutinas Asignadas
  </Typography>
          <Divider sx={{ my: 2 }} />
          {cliente.rutinas?.length > 0 ? (
            <TableContainer>
              <Table>
              <TableHead>
  <TableRow>
    <TableCell><Typography sx={{ color: 'white' }}>Nombre</Typography></TableCell>
    <TableCell><Typography sx={{ color: 'white' }}>Descripción</Typography></TableCell>
    <TableCell><Typography sx={{ color: 'white' }}>Entrenador</Typography></TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {cliente.rutinas.map(rutina => (
    <TableRow key={rutina.id}>
      <TableCell><Typography sx={{ color: 'white' }}>{rutina.nombre}</Typography></TableCell>
      <TableCell>
        <Typography 
          sx={{ 
            color: 'white',
            maxHeight: '150px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.1)'
            }
          }}
          dangerouslySetInnerHTML={{ __html: rutina.descripcion }}
        />
      </TableCell>
      <TableCell><Typography sx={{ color: 'white' }}>{`${rutina.entrenador.nombre} ${rutina.entrenador.apellido}`}</Typography></TableCell>
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
      <Paper sx={{ 
  p: 3,
  mb: 3,
  backgroundColor: 'white',
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  borderRadius: '12px',
  '& .MuiTableCell-root': { // Estilo para las celdas de la tabla
    borderColor: 'rgba(0,0,0,0.1)',
  },
  '& .MuiTypography-root': { // Estilo para los textos
    color: 'text.primary'
  },
  '& .title': { // Estilo para el título
    borderBottom: '2px solid #1976d2',
    paddingBottom: 1,
    marginBottom: 2,
    color: '#1976d2',
    fontWeight: 600
  }
}}>
  <Typography className="title" variant="h5" gutterBottom>
    Clases Inscritas
  </Typography>
          <Divider sx={{ my: 2 }} />
          {cliente.clasesInscritas?.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography sx={{ color: 'white' }}>Nombre</Typography></TableCell>
                    <TableCell><Typography sx={{ color: 'white' }}>Día</Typography></TableCell>
                    <TableCell><Typography sx={{ color: 'white' }}>Horario</Typography></TableCell>
                    <TableCell><Typography sx={{ color: 'white' }}>Entrenador</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cliente.clasesInscritas.map(clase => (
                    <TableRow key={clase.id}>
                      <TableCell><Typography sx={{ color: 'white' }}>{clase.nombre}</Typography></TableCell>
                      <TableCell><Typography sx={{ color: 'white' }}>{clase.dia}</Typography></TableCell>
                      <TableCell><Typography sx={{ color: 'white' }}>{clase.horario}</Typography></TableCell>
                      <TableCell><Typography sx={{ color: 'white' }}>
                        {clase.entrenador ? 
                          `${clase.entrenador.nombre} ${clase.entrenador.apellido}` : 
                          'Sin entrenador'}
                      </Typography></TableCell>
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
      <Paper sx={{ p: 3,
}}>
        <Typography variant="h5" gutterBottom>Seguimiento</Typography>
        <Divider sx={{ my: 2 }} />
        {cliente?.seguimientos?.length > 0 ? (
  <Box sx={{ height: '500px', width: '100%', p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
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