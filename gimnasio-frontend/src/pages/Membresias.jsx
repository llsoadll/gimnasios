import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, TextField, FormControl, Select, MenuItem,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Box, Typography, Grid, Card, CardContent, Chip, InputLabel
} from '@mui/material';
import moment from 'moment';
import api from '../utils/axios';
import { CardMembership, CalendarToday, Person, AttachMoney, CheckCircle, Cancel, Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';


const Membresias = () => {
  const [membresias, setMembresias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [membresiaToDelete, setMembresiaToDelete] = useState(null);
const [mensaje, setMensaje] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
const [filterTipo, setFilterTipo] = useState('');
const [filterEstado, setFilterEstado] = useState('');
  const [nuevaMembresia, setNuevaMembresia] = useState({
    clienteId: '',
    fechaInicio: '',
    precio: '',
    tipo: 'MENSUAL',
    activa: true
  });
  const [editDialog, setEditDialog] = useState(false);
const [membresiaEdit, setMembresiaEdit] = useState({
  id: '',
  clienteId: '',
  fechaInicio: '',
  precio: '',
  tipo: '',
  activa: true
});

  useEffect(() => {
    fetchMembresias();
    fetchClientes();
  }, []);

  const formatearFecha = (fecha) => {
    // Si la fecha viene como array [año, mes, día]
    if (Array.isArray(fecha)) {
      return moment([fecha[0], fecha[1] - 1, fecha[2]]).format('DD/MM/YYYY');
    }
    // Si la fecha viene como string
    return moment(fecha).format('DD/MM/YYYY');
  };

  const fetchMembresias = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/membresias'); // Cambiar axios.get por api.get
      setMembresias(response.data);
    } catch (err) {
      setError('Error al cargar membresías. Verifica que el servidor esté funcionando.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const membresiasFiltradas = membresias.filter(membresia => {
    const matchSearch = searchTerm === '' || 
      `${membresia.cliente.nombre} ${membresia.cliente.apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
        
    const matchTipo = filterTipo === '' || membresia.tipo === filterTipo;
    
    const matchEstado = filterEstado === '' || 
      membresia.activa === (filterEstado === 'true');
      
    return matchSearch && matchTipo && matchEstado;
  });
  
  const fetchClientes = async () => {
    try {
      const response = await api.get('/usuarios'); // Cambiar axios.get por api.get
      const clientesData = Array.isArray(response.data) ? 
        response.data.filter(u => u.tipo === 'CLIENTE') : [];
      setClientes(clientesData);
    } catch (err) {
      console.error('Error:', err);
      setClientes([]);
    }
  };


  const handleEditClick = (membresia) => {
    setMembresiaEdit({
      id: membresia.id,
      clienteId: membresia.cliente.id,
      fechaInicio: moment(membresia.fechaInicio).format('YYYY-MM-DD'),
      precio: membresia.precio,
      tipo: membresia.tipo,
      activa: membresia.activa
    });
    setEditDialog(true);
  };


  const actualizarMembresia = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const membresiaData = {
        cliente: {
          id: parseInt(membresiaEdit.clienteId)
        },
        fechaInicio: membresiaEdit.fechaInicio,
        precio: parseFloat(membresiaEdit.precio),
        tipo: membresiaEdit.tipo,
        activa: membresiaEdit.activa
      };
      
      await api.put(`/membresias/${membresiaEdit.id}`, membresiaData);
      await fetchMembresias();
      setEditDialog(false);
      setMensaje("Membresía actualizada exitosamente");
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setError('Error al actualizar membresía');
    } finally {
      setLoading(false);
    }
  };

const eliminarMembresia = async (id) => {
  if (window.confirm('¿Está seguro de eliminar esta membresía?')) {
      try {
          await api.delete(`/membresias/${id}`);
          setMembresias(membresias.filter(membresia => membresia.id !== id));
          setMensaje("Membresía eliminada exitosamente");
          setTimeout(() => setMensaje(null), 3000);
      } catch (err) {
          setError('Error al eliminar membresía');
          console.error('Error:', err);
      }
  }
};

const handleDeleteClick = (membresiaId) => {
  setMembresiaToDelete(membresiaId);
  setDeleteDialogOpen(true);
};

const handleDeleteConfirm = async () => {
  try {
    await eliminarMembresia(membresiaToDelete);
    setDeleteDialogOpen(false);
    setMembresiaToDelete(null);
  } catch (err) {
    console.error('Error al eliminar:', err);
    setError('Error al eliminar la membresía');
  }
};

const agregarMembresia = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const fechaInicio = moment(nuevaMembresia.fechaInicio).format('YYYY-MM-DD');
    
    const response = await api.post('/membresias', { // Cambiar axios.post por api.post
      cliente: {
        id: parseInt(nuevaMembresia.clienteId)
      },
      fechaInicio: fechaInicio,
      precio: parseFloat(nuevaMembresia.precio),
      tipo: nuevaMembresia.tipo,
      activa: nuevaMembresia.activa
    });
    
    await fetchMembresias();
    setOpenDialog(false);
  } catch (err) {
    setError('Error al crear membresía');
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
      {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid #1976d2', pb: 2 }}>
        <CardMembership 
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
          Listado de Membresías
        </Typography>
      </Box>


      <Button 
        variant="contained" 
        onClick={() => setOpenDialog(true)} 
        sx={{ mb: 2 }}
      >
        Nueva Membresía
      </Button>

      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
  <TextField
    label="Buscar membresía"
    variant="outlined"
    size="small"
    sx={{ width: 300 }}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Buscar por nombre de cliente..."
  />
  <FormControl size="small" sx={{ minWidth: 200 }}>
    <InputLabel>Filtrar por tipo</InputLabel>
    <Select
      value={filterTipo || ''}
      onChange={(e) => setFilterTipo(e.target.value)}
      label="Filtrar por tipo"
    >
      <MenuItem value="">Todos</MenuItem>
      <MenuItem value="MENSUAL">Mensual</MenuItem>
      <MenuItem value="TRIMESTRAL">Trimestral</MenuItem>
      <MenuItem value="ANUAL">Anual</MenuItem>
    </Select>
  </FormControl>
  <FormControl size="small" sx={{ minWidth: 200 }}>
    <InputLabel>Estado</InputLabel>
    <Select
      value={filterEstado || ''}
      onChange={(e) => setFilterEstado(e.target.value)}
      label="Estado"
    >
      <MenuItem value="">Todos</MenuItem>
      <MenuItem value="true">Activas</MenuItem>
      <MenuItem value="false">Inactivas</MenuItem>
    </Select>
  </FormControl>
</Box>

      <Grid container spacing={3}>
      {membresiasFiltradas.map((membresia) => (
    <Grid item xs={12} sm={6} md={4} key={membresia.id}>
      <Card 
        sx={{ 
          height: '100%',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 3
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" color="primary">
              {membresia.tipo}
            </Typography>
            <Chip 
              label={membresia.activa ? 'Activa' : 'Inactiva'}
              color={membresia.activa ? 'success' : 'error'}
              size="small"
              icon={membresia.activa ? <CheckCircle /> : <Cancel />}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Person sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body1">
              {`${membresia.cliente.nombre} ${membresia.cliente.apellido}`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {`${new Date(membresia.fechaInicio).toLocaleDateString()} - ${new Date(membresia.fechaFin).toLocaleDateString()}`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6" color="primary">
              ${membresia.precio}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
  size="small"
  variant="contained"
  onClick={() => handleEditClick(membresia)}
  startIcon={<EditIcon />}
>
  Editar
</Button>
<Button
  size="small"
  variant="outlined"
  color="error"
  onClick={() => handleDeleteClick(membresia.id)}
  startIcon={<DeleteIcon />}
>
  Eliminar
</Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>


      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Nueva Membresía</DialogTitle>
        <DialogContent>
          <form onSubmit={agregarMembresia}>
            <FormControl fullWidth margin="normal">
              <Select
                value={nuevaMembresia.clienteId}
                onChange={e => setNuevaMembresia({...nuevaMembresia, clienteId: e.target.value})}
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
            <TextField 
              fullWidth
              margin="normal"
              label="Fecha Inicio" 
              type="date"
              InputLabelProps={{ shrink: true }}
              value={nuevaMembresia.fechaInicio}
              onChange={e => setNuevaMembresia({...nuevaMembresia, fechaInicio: e.target.value})}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Precio" 
              type="number"
              value={nuevaMembresia.precio}
              onChange={e => setNuevaMembresia({...nuevaMembresia, precio: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <Select
                value={nuevaMembresia.tipo}
                onChange={e => setNuevaMembresia({...nuevaMembresia, tipo: e.target.value})}
              >
                <MenuItem value="MENSUAL">Mensual</MenuItem>
                <MenuItem value="TRIMESTRAL">Trimestral</MenuItem>
                <MenuItem value="ANUAL">Anual</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Select
                value={nuevaMembresia.activa}
                onChange={e => setNuevaMembresia({...nuevaMembresia, activa: e.target.value})}
              >
                <MenuItem value={true}>Activa</MenuItem>
                <MenuItem value={false}>Inactiva</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={agregarMembresia} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
  <DialogTitle>Confirmar Eliminación</DialogTitle>
  <DialogContent>
    ¿Está seguro que desea eliminar esta membresía?
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
    <Button onClick={handleDeleteConfirm} color="error">Eliminar</Button>
  </DialogActions>
</Dialog>

<Dialog open={editDialog} onClose={() => setEditDialog(false)}>
  <DialogTitle>Editar Membresía</DialogTitle>
  <DialogContent>
    <form onSubmit={actualizarMembresia}>
      <FormControl fullWidth margin="normal">
        <Select
          value={membresiaEdit.clienteId}
          onChange={e => setMembresiaEdit({...membresiaEdit, clienteId: e.target.value})}
        >
          {clientes.map(cliente => (
            <MenuItem key={cliente.id} value={cliente.id}>
              {`${cliente.nombre} ${cliente.apellido}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField 
        fullWidth
        margin="normal"
        label="Fecha Inicio" 
        type="date"
        InputLabelProps={{ shrink: true }}
        value={membresiaEdit.fechaInicio}
        onChange={e => setMembresiaEdit({...membresiaEdit, fechaInicio: e.target.value})}
      />
      <TextField 
        fullWidth
        margin="normal"
        label="Precio" 
        type="number"
        value={membresiaEdit.precio}
        onChange={e => setMembresiaEdit({...membresiaEdit, precio: e.target.value})}
      />
      <FormControl fullWidth margin="normal">
        <Select
          value={membresiaEdit.tipo}
          onChange={e => setMembresiaEdit({...membresiaEdit, tipo: e.target.value})}
        >
          <MenuItem value="MENSUAL">Mensual</MenuItem>
          <MenuItem value="TRIMESTRAL">Trimestral</MenuItem>
          <MenuItem value="ANUAL">Anual</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Select
          value={membresiaEdit.activa}
          onChange={e => setMembresiaEdit({...membresiaEdit, activa: e.target.value})}
        >
          <MenuItem value={true}>Activa</MenuItem>
          <MenuItem value={false}>Inactiva</MenuItem>
        </Select>
      </FormControl>
    </form>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setEditDialog(false)}>Cancelar</Button>
    <Button onClick={actualizarMembresia} variant="contained">
      Guardar Cambios
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
};

export default Membresias;