import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, TextField, FormControl, Select, MenuItem,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Box, Grid, Typography, InputLabel
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
import { Assessment } from '@mui/icons-material';
import moment from 'moment';

const Seguimientos = () => {
  const [seguimientos, setSeguimientos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nuevoSeguimiento, setNuevoSeguimiento] = useState({
    fecha: new Date().toISOString().split('T')[0],
    peso: '',
    altura: '',
    imc: '',
    observaciones: ''
  });
  
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  useEffect(() => {
    if (userRole === 'ADMIN' || userRole === 'ENTRENADOR') {
      fetchClientes();
    } else if (userRole === 'CLIENTE') {
      fetchSeguimientos(userId);
    }
  }, [userRole, userId]);

  const fetchClientes = async () => {
    try {
      const response = await api.get('/usuarios');
      setClientes(response.data.filter(u => u.tipo === 'CLIENTE'));
    } catch (err) {
      setError('Error al cargar clientes');
    }
  };

  const eliminarSeguimiento = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este seguimiento?')) {
      try {
        await api.delete(`/seguimientos/${id}`);
        await fetchSeguimientos(selectedCliente);
        setMensaje("Seguimiento eliminado exitosamente");
        setTimeout(() => setMensaje(null), 3000);
      } catch (err) {
        setError('Error al eliminar seguimiento');
        console.error('Error:', err);
      }
    }
  };

  const fetchSeguimientos = async (clienteId) => {
    if (!clienteId) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/seguimientos/cliente/${clienteId}`);
      setSeguimientos(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar seguimientos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === 'ADMIN' || userRole === 'ENTRENADOR') {
      fetchClientes();
    } else if (userRole === 'CLIENTE') {
      fetchSeguimientos(userId);
    }
  }, [userRole, userId]);
  
  useEffect(() => {
    if (selectedCliente) {
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

  const chartData = {
    labels: seguimientos.map(s => moment(s.fecha).format('DD/MM/YYYY')),
    datasets: [
      {
        label: 'Peso (kg)',
        data: seguimientos.map(s => s.peso),
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
        data: seguimientos.map(s => s.imc),
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
            size: 12,
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
            size: 12,
            weight: 'bold'
          }
        }
      }
    }
  };


  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
  
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid #1976d2', pb: 2 }}>
        <Assessment 
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
          Listado de Seguimientos
        </Typography>
      </Box>


      {/* Admin view */}
      {(userRole === 'ADMIN' || userRole === 'ENTRENADOR') && (
        <Box sx={{ 
          mb: 2, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, // Columna en móvil, fila en desktop
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'center' }
        }}>
          <TextField
            label="Buscar cliente"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: '100%', sm: 300 } }}
            placeholder="Buscar por nombre..."
          />
        
        {/* Selector de cliente filtrado */}
        <FormControl sx={{ width: { xs: '100%', sm: 300 } }}>
    <InputLabel>Cliente</InputLabel>
    <Select
      value={selectedCliente}
      onChange={(e) => setSelectedCliente(e.target.value)}
      label="Cliente"
    >
            <MenuItem value="" disabled>Seleccionar Cliente</MenuItem>
            {clientes
              .filter(cliente => 
                searchTerm === '' || 
                `${cliente.nombre} ${cliente.apellido}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map(cliente => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {`${cliente.nombre} ${cliente.apellido}`}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      
        {/* Botón de nuevo seguimiento */}
        {selectedCliente && (
    <Button 
      variant="contained"
      onClick={() => setOpenDialog(true)}
      sx={{ 
        width: { xs: '100%', sm: 'auto' },
        alignSelf: { sm: 'flex-start' }
      }}
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
          <TableContainer component={Paper} sx={{ 
  overflowX: 'auto',
  '& .MuiTable-root': {
    minWidth: { xs: 'max-content', md: '100%' }
  }
}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Peso (kg)</TableCell>
                    <TableCell>Altura (cm)</TableCell>
                    <TableCell>IMC</TableCell>
                    <TableCell>Observaciones</TableCell>
                    {userRole === 'ADMIN' && <TableCell>Acciones</TableCell>}
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
                      {userRole === 'ADMIN' && (
        <TableCell>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => eliminarSeguimiento(seguimiento.id)}
          >
            Eliminar
          </Button>
        </TableCell>
      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
          <Box sx={{ 
  height: { xs: '300px', sm: '400px', md: '500px' }, // Altura responsive
  width: '100%',
  p: { xs: 1, sm: 2 }, // Padding responsive
  bgcolor: 'white',
  borderRadius: 2,
  boxShadow: 1,
  mb: 3 // Margen inferior
}}>
  <Line 
    data={chartData} 
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
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
              size: 12,
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
              size: 12,
              weight: 'bold'
            }
          }
        }
      }
    }}
  />
</Box>
    </Grid>
        </Grid>
      )}

{(userRole === 'ADMIN' || userRole === 'ENTRENADOR') && (
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