import React, { useState, useEffect } from 'react';
import { 
  Button, Container, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, FormControl, InputLabel, Select, MenuItem, Grid, Card,
  CardContent, CardMedia, Typography, Box, Chip, Alert, CircularProgress,
  Tabs, Tab, CardActions
} from '@mui/material';
// Remove DeleteIcon from first import since it's duplicated
import { VisibilityIcon, EditIcon, PlayArrowIcon } from '@mui/icons-material';
// Keep DeleteIcon here with Add and Assignment icons
import { Add as AddIcon, Assignment as AssignmentIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../services/api';


const Rutinas = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [asignarDialogOpen, setAsignarDialogOpen] = useState(false);
const [selectedTemplate, setSelectedTemplate] = useState(null);
  const userRole = localStorage.getItem('userRole');

  const [nuevaRutina, setNuevaRutina] = useState({
    nombre: '',
    descripcion: '',
    nivel: 'PRINCIPIANTE',
    categoria: 'FUERZA',
    duracionMinutos: 0,
    imagenUrl: '',
    entrenadorId: '',
    clienteId: ''
  });

  useEffect(() => {
    if (tabValue === 0) {
      fetchTemplates();
    } else {
      fetchRutinas();
    }
    fetchUsuarios();
  }, [tabValue]);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/rutinas/templates');
      setTemplates(response.data);
    } catch (err) {
      setError('Error al cargar templates');
    }
  };

  const fetchRutinas = async () => {
    try {
      const response = await api.get('/rutinas');
      setRutinas(response.data);
    } catch (err) {
      setError('Error al cargar rutinas');
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setClientes(response.data.filter(u => u.tipo === 'CLIENTE'));
      setEntrenadores(response.data.filter(u => u.tipo === 'ENTRENADOR'));
    } catch (err) {
      setError('Error al cargar usuarios');
    }
  };

  const eliminarTemplate = async (templateId) => {
    if (window.confirm('¿Está seguro que desea eliminar este template?')) {
      try {
        await api.delete(`/rutinas/templates/${templateId}`);
        setTemplates(prevTemplates => prevTemplates.filter(t => t.id !== templateId));
        setError(null);
      } catch (err) {
        setError(`Error al eliminar template: ${err.response?.data?.message || err.message}`);
      }
    }
};
  
  const eliminarRutina = async (rutinaId) => {
    if (window.confirm('¿Está seguro que desea eliminar esta rutina?')) {
      try {
        await api.delete(`/rutinas/${rutinaId}`);
        setRutinas(prevRutinas => prevRutinas.filter(r => r.id !== rutinaId));
        setError(null);
      } catch (err) {
        setError(`Error al eliminar rutina: ${err.response?.data?.message || err.message}`);
      }
    }
  };


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Función para asignar un template a un cliente
const asignarTemplate = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await api.post(
      `/rutinas/templates/${selectedTemplate.id}/asignar/${nuevaRutina.clienteId}`
    );
    
    if (response.status === 200) {
      await fetchRutinas();
      setAsignarDialogOpen(false);
      setSelectedTemplate(null);
      limpiarFormulario();
    }
  } catch (err) {
    setError(`Error al asignar rutina: ${err.response?.data?.message || err.message}`);
  } finally {
    setLoading(false);
  }
};

  const agregarTemplate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure entrenadorId is set correctly
      const templateData = {
        nombre: nuevaRutina.nombre,
        descripcion: nuevaRutina.descripcion,
        nivel: nuevaRutina.nivel || 'PRINCIPIANTE',
        categoria: nuevaRutina.categoria || 'FUERZA',
        duracionMinutos: nuevaRutina.duracionMinutos || 0,
        imagenUrl: nuevaRutina.imagenUrl || '',
        entrenadorId: userRole === 'ADMIN' ? 
          parseInt(nuevaRutina.entrenadorId) : 
          parseInt(localStorage.getItem('userId'))
      };
  
      console.log('Enviando template:', templateData);
      
      const response = await api.post('/rutinas/templates', templateData);
      console.log('Respuesta:', response);
  
      if (response.status === 201) {
        // Update local state with the new template
        setTemplates(prevTemplates => [...prevTemplates, response.data]);
        
        // Close dialog and reset form
        setOpenDialog(false);
        limpiarFormulario();
        
        // Fetch updated list
        await fetchTemplates();
      }
    } catch (err) {
      console.error('Error al crear template:', err);
      setError(`Error al crear template: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const agregarRutina = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!nuevaRutina.clienteId && tabValue === 1) {
        setError('Debe seleccionar un cliente');
        return;
      }
  
      const rutinaData = {
        nombre: nuevaRutina.nombre,
        descripcion: nuevaRutina.descripcion,
        nivel: nuevaRutina.nivel || 'PRINCIPIANTE',
        categoria: nuevaRutina.categoria || 'FUERZA',
        duracionMinutos: nuevaRutina.duracionMinutos || 0,
        imagenUrl: nuevaRutina.imagenUrl || '',
        clienteId: parseInt(nuevaRutina.clienteId),
        entrenadorId: userRole === 'ADMIN' ? 
          parseInt(nuevaRutina.entrenadorId) : 
          parseInt(localStorage.getItem('userId'))
      };
  
      console.log('Enviando rutina:', rutinaData);
      
      const response = await api.post('/rutinas', rutinaData);
      console.log('Respuesta:', response);
  
      if (response.status === 201) {
        setRutinas(prevRutinas => [...prevRutinas, response.data]);
        setOpenDialog(false);
        limpiarFormulario();
        await fetchRutinas();
      }
    } catch (err) {
      console.error('Error al crear rutina:', err);
      setError(`Error al crear rutina: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setNuevaRutina({
      nombre: '',
      descripcion: '',
      nivel: 'PRINCIPIANTE',
      categoria: 'FUERZA',
      duracionMinutos: 0,
      imagenUrl: '',
      entrenadorId: '',
      clienteId: ''
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Tabs value={tabValue} onChange={handleTabChange}>
      <Tab label="Templates" />
      <Tab label="Rutinas Asignadas" />
    </Tabs>

    {/* Botones de acción según la pestaña */}
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      mb: 3, 
      mt: 2,
      borderBottom: '2px solid #1976d2',
      pb: 2 
    }}>
      {tabValue === 0 ? (
        // Pestaña Templates
        userRole === 'ADMIN' && (
          <Button 
            variant="contained" 
            onClick={() => setOpenDialog(true)}
            startIcon={<AddIcon />}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              color: 'white',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #21CBF3 30%, #1976d2 90%)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Nuevo Template
          </Button>
        )
      ) : (
        // Pestaña Rutinas Asignadas
        <>
          <Button 
            variant="contained"
            onClick={() => setAsignarDialogOpen(true)}
            startIcon={<AssignmentIcon />}
            sx={{
              background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
              color: 'white',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #21CBF3 30%, #2196f3 90%)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Asignar Template
          </Button>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              alignSelf: 'center',
              color: 'text.secondary',
              fontStyle: 'italic'
            }}
          >
            Selecciona un template existente para asignarlo a un cliente
          </Typography>
        </>
      )}
    </Box>

      {/* Grid de templates o rutinas */}
      <Grid container spacing={3}>
      {(tabValue === 0 ? templates : rutinas).map((item) => (
  <Grid item xs={12} sm={6} md={4} key={item.id}>
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={item.imagenUrl || '/images/default-routine.jpg'}
        alt={item.nombre}
      />
      <CardContent>
        <Typography variant="h5" gutterBottom>{item.nombre}</Typography>
        <Typography variant="body2" color="text.secondary">
          {item.descripcion}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Chip label={item.nivel} size="small" />
          <Chip label={item.categoria} variant="outlined" size="small" />
        </Box>
      </CardContent>
      <CardActions sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
        {userRole === 'ADMIN' && (
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => tabValue === 0 ? eliminarTemplate(item.id) : eliminarRutina(item.id)}
          >
            Eliminar
          </Button>
        )}
      </CardActions>
    </Card>
  </Grid>
))}
      </Grid>

      {/* Diálogo para crear template/rutina */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {tabValue === 0 ? 'Nuevo Template' : 'Nueva Rutina'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={tabValue === 0 ? agregarTemplate : agregarRutina}>
            <TextField 
              fullWidth
              margin="normal"
              label="Nombre" 
              value={nuevaRutina.nombre}
              onChange={e => setNuevaRutina({...nuevaRutina, nombre: e.target.value})}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Descripción"
              multiline
              rows={4}
              value={nuevaRutina.descripcion}
              onChange={e => setNuevaRutina({...nuevaRutina, descripcion: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Nivel</InputLabel>
              <Select
                value={nuevaRutina.nivel}
                onChange={e => setNuevaRutina({...nuevaRutina, nivel: e.target.value})}
                label="Nivel"
              >
                <MenuItem value="PRINCIPIANTE">Principiante</MenuItem>
                <MenuItem value="INTERMEDIO">Intermedio</MenuItem>
                <MenuItem value="AVANZADO">Avanzado</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={nuevaRutina.categoria}
                onChange={e => setNuevaRutina({...nuevaRutina, categoria: e.target.value})}
                label="Categoría"
              >
                <MenuItem value="FUERZA">Fuerza</MenuItem>
                <MenuItem value="CARDIO">Cardio</MenuItem>
                <MenuItem value="FLEXIBILIDAD">Flexibilidad</MenuItem>
              </Select>
            </FormControl>

            {/* Cliente selector solo para Rutinas */}
            {tabValue === 1 && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={nuevaRutina.clienteId || ''}
                  onChange={e => setNuevaRutina({...nuevaRutina, clienteId: e.target.value})}
                  label="Cliente"
                >
                  <MenuItem value="" disabled>Seleccionar Cliente</MenuItem>
                  {clientes.map(cliente => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {`${cliente.nombre} ${cliente.apellido}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Entrenador selector solo para ADMIN */}
            {userRole === 'ADMIN' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Entrenador</InputLabel>
                <Select
                  value={nuevaRutina.entrenadorId || ''}
                  onChange={e => setNuevaRutina({...nuevaRutina, entrenadorId: e.target.value})}
                  label="Entrenador"
                >
                  <MenuItem value="" disabled>Seleccionar Entrenador</MenuItem>
                  {entrenadores.map(entrenador => (
                    <MenuItem key={entrenador.id} value={entrenador.id}>
                      {`${entrenador.nombre} ${entrenador.apellido}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button type="submit" variant="contained">Guardar</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Nuevo diálogo para asignar template */}
    <Dialog open={asignarDialogOpen} onClose={() => setAsignarDialogOpen(false)}>
      <DialogTitle>Asignar Template</DialogTitle>
      <DialogContent>
        <form onSubmit={asignarTemplate}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Template</InputLabel>
            <Select
              value={selectedTemplate?.id || ''}
              onChange={e => setSelectedTemplate(templates.find(t => t.id === e.target.value))}
              label="Template"
            >
              <MenuItem value="" disabled>Seleccionar Template</MenuItem>
              {templates.map(template => (
                <MenuItem key={template.id} value={template.id}>
                  {template.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Cliente</InputLabel>
            <Select
              value={nuevaRutina.clienteId || ''}
              onChange={e => setNuevaRutina({...nuevaRutina, clienteId: e.target.value})}
              label="Cliente"
            >
              <MenuItem value="" disabled>Seleccionar Cliente</MenuItem>
              {clientes.map(cliente => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {`${cliente.nombre} ${cliente.apellido}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DialogActions>
            <Button onClick={() => setAsignarDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Asignar</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default Rutinas;