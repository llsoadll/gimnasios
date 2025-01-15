import React, { useState, useEffect } from 'react';
import { 
  Button, Container, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, FormControl, InputLabel, Select, MenuItem, Grid, Card,
  CardContent, CardMedia, Typography, Box, Chip, Alert, CircularProgress,
  Tabs, Tab, CardActions
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// Remove DeleteIcon from first import since it's duplicated
import { VisibilityIcon, PlayArrowIcon } from '@mui/icons-material';
// Keep DeleteIcon here with Add and Assignment icons
import { Add as AddIcon, Assignment as AssignmentIcon, Delete as DeleteIcon, Person as PersonIcon, Edit as EditIcon } from '@mui/icons-material';
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
const [searchTerm, setSearchTerm] = useState('');
const [filterNivel, setFilterNivel] = useState('');
const [paginaActual, setPaginaActual] = useState(1);
const [templateEdit, setTemplateEdit] = useState(null);
const [editDialogOpen, setEditDialogOpen] = useState(false);
const [itemsPorPagina] = useState(6); // 6 rutinas por página
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
    // Si es CLIENTE, solo cargar sus rutinas
    if (userRole === 'CLIENTE') {
      fetchRutinas();
    } else {
      // Si es ADMIN o ENTRENADOR, cargar según la pestaña seleccionada
      if (tabValue === 0) {
        fetchTemplates();
      } else {
        fetchRutinas();
      }
    }
    fetchUsuarios();
  }, [tabValue, userRole]);


  // Definir colores por nivel
const nivelColors = {
  PRINCIPIANTE: '#4caf50', // Verde
  INTERMEDIO: '#ff9800',   // Naranja
  AVANZADO: '#f44336'      // Rojo
};

// Definir colores por categoría
const categoriaColors = {
  FUERZA: '#2196f3',       // Azul
  CARDIO: '#9c27b0',       // Púrpura
  FLEXIBILIDAD: '#00bcd4'  // Cyan
};

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
      // Si el usuario es CLIENTE, obtener solo sus rutinas
      if (userRole === 'CLIENTE') {
        const clienteId = localStorage.getItem('userId');
        const response = await api.get(`/rutinas/cliente/${clienteId}`);
        setRutinas(response.data);
      } else {
        // Si es ADMIN/ENTRENADOR, obtener todas las rutinas
        const response = await api.get('/rutinas');
        setRutinas(response.data);
      }
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

  const convertirUrlUnsplash = (url) => {
    if (url.includes('unsplash.com')) {
      const match = url.match(/photo-([^?]+)/);
      if (match) {
        const photoId = match[1];
        // Añade .jpg al final de la URL
        return `https://images.unsplash.com/photo-${photoId}?fm=jpg&q=80&w=1920&fit=crop.jpg`;
      }
    }
    return url;
  };

  const rutinasFiltradas = rutinas.filter(rutina => {
    const matchSearch = searchTerm === '' || 
      rutina.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rutina.cliente && `${rutina.cliente.nombre} ${rutina.cliente.apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()));
        
    const matchNivel = filterNivel === '' || rutina.nivel === filterNivel;
        
    return matchSearch && matchNivel;
  });
  
  // Calcular rutinas paginadas
  const totalPaginas = Math.ceil(rutinasFiltradas.length / itemsPorPagina);
  const rutinasAPaginar = rutinasFiltradas.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

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

const validarImagenUrl = (url) => {
  if (!url) return true; // Permite URLs vacías
  // Verifica si es una URL de Unsplash
  if (url.includes('unsplash.com')) {
    return true; // Acepta URLs de Unsplash sin validar extensión
  }
  // Para otras URLs, verifica la extensión
  return url.match(/\.(jpeg|jpg|gif|png)$/i) != null;
};

const agregarTemplate = async (e) => {
  e.preventDefault();
  let imageUrl = nuevaRutina.imagenUrl;
  if (imageUrl) {
    imageUrl = convertirUrlUnsplash(imageUrl);
    if (!validarImagenUrl(imageUrl)) {
      setError('La URL de la imagen debe terminar en .jpg, .jpeg, .gif o .png');
      return;
    }
  }
  setLoading(true);
    try {
      // Ensure entrenadorId is set correctly
      const templateData = {
        nombre: nuevaRutina.nombre,
        imagenUrl: imageUrl,
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

  const actualizarTemplate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/rutinas/templates/${templateEdit.id}`, templateEdit);
      if (response.status === 200) {
        setTemplates(templates.map(t => 
          t.id === templateEdit.id ? response.data : t
        ));
        setEditDialogOpen(false);
        setTemplateEdit(null);
      }
    } catch (err) {
      setError('Error al actualizar template');
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


{/* Encabezado con ícono y título */}
<Box sx={{ 
  display: 'flex', 
  alignItems: 'center', 
  mb: 4, 
  borderBottom: '2px solid #1976d2', 
  pb: 2 
}}>
  <AssignmentIcon sx={{ 
    fontSize: 35, 
    mr: 2, 
    color: 'primary.main',
    transform: 'rotate(-15deg)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'rotate(0deg) scale(1.1)'
    }
  }} />
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
    {userRole === 'CLIENTE' ? 'Mis Rutinas' : (tabValue === 0 ? 'Lista de Templates' : 'Rutinas Asignadas')}
  </Typography>
</Box>



{(userRole === 'ADMIN' || userRole === 'ENTRENADOR') && (
  <>
    <Tabs value={tabValue} onChange={handleTabChange}>
      <Tab label="Templates" />
      <Tab label="Rutinas Asignadas" />
    </Tabs>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, mt: 2 }}>
      {tabValue === 0 ? (
        <Button 
          variant="contained" 
          onClick={() => setOpenDialog(true)}
          startIcon={<AddIcon />}
          sx={{ 
            width: { xs: '100%', sm: 'auto' },
            alignSelf: { sm: 'flex-start' }
          }}
        >
          Nuevo Template
        </Button>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="contained"
            onClick={() => setAsignarDialogOpen(true)}
            startIcon={<AssignmentIcon />}
            sx={{ 
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Asignar Template
          </Button>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: 'text.secondary',
              fontStyle: 'italic'
            }}
          >
            Selecciona un template existente para asignarlo a un cliente
          </Typography>
        </Box>
      )}
    </Box>
  </>
)}


    {tabValue === 1 && (
  <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
    <TextField
      label="Buscar rutina"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ width: 300 }}
      placeholder="Buscar por nombre o cliente..."
    />
    
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Nivel</InputLabel>
      <Select
        value={filterNivel}
        onChange={(e) => setFilterNivel(e.target.value)}
        label="Nivel"
      >
        <MenuItem value="">Todos</MenuItem>
        <MenuItem value="PRINCIPIANTE">Principiante</MenuItem>
        <MenuItem value="INTERMEDIO">Intermedio</MenuItem>
        <MenuItem value="AVANZADO">Avanzado</MenuItem>
      </Select>
    </FormControl>
  </Box>
)}

      {/* Grid de templates o rutinas */}
<Grid container spacing={3}>
  {userRole === 'CLIENTE' ? (
    // Vista para CLIENTE - solo muestra sus rutinas asignadas
    rutinas.map((rutina) => (
      <Grid item xs={12} sm={6} md={4} key={rutina.id}>
        <Card sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s, box-shadow 0.3s',
          borderLeft: `5px solid ${nivelColors[rutina.nivel]}`,
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
          }
        }}>
          <CardMedia
            component="img"
            height="200"
            image={rutina.imagenUrl || '/images/default-routine.jpg'}
            alt={rutina.nombre}
            onError={(e) => {
              e.target.src = '/images/default-routine.jpg';
              e.target.onerror = null;
            }}
          />
          <CardContent>
            <Typography variant="h5" gutterBottom>{rutina.nombre}</Typography>
            <Typography 
  variant="body2" 
  color="text.secondary"
  dangerouslySetInnerHTML={{ __html: rutina.descripcion }}
  sx={{ mb: 2 }}
/>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={rutina.nivel}
                size="small"
                sx={{ 
                  bgcolor: `${nivelColors[rutina.nivel]}`,
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
              <Chip 
                label={rutina.categoria}
                size="small"
                sx={{ 
                  bgcolor: `${categoriaColors[rutina.categoria]}`,
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))
  ) : (
    // Vista para ADMIN/ENTRENADOR - muestra templates o rutinas según la pestaña
    (tabValue === 0 ? templates : rutinasAPaginar).map((item) => (
      <Grid item xs={12} sm={6} md={4} key={item.id}>
        <Card sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s, box-shadow 0.3s',
          borderLeft: `5px solid ${nivelColors[item.nivel]}`,
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
            onError={(e) => {
              e.target.src = '/images/default-routine.jpg';
              e.target.onerror = null;
            }}
          />
          <CardContent>
            <Typography variant="h5" gutterBottom>{item.nombre}</Typography>
            <Typography 
    variant="body2" 
    color="text.secondary"
    dangerouslySetInnerHTML={{ __html: item.descripcion }}
    sx={{ mb: 2 }}
  />
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={item.nivel}
                size="small"
                sx={{ 
                  bgcolor: `${nivelColors[item.nivel]}`,
                  color: 'white',
                  fontWeight: 'bold'  
                }}
              />
              <Chip 
                label={item.categoria}
                size="small"
                sx={{ 
                  bgcolor: `${categoriaColors[item.categoria]}`,
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />

              {/* Agregar esta parte para mostrar el cliente cuando es una rutina asignada */}
              {tabValue === 1 && item.cliente && (
  <Box sx={{ 
    mt: 2,
    p: 1.5,
    width: '100%', // Añadir esto para que ocupe todo el ancho
    borderRadius: '8px',
    bgcolor: 'rgba(25, 118, 210, 0.1)',
    border: '1px solid rgba(25, 118, 210, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: 1
  }}>
    <PersonIcon sx={{ 
      color: 'primary.main',
      fontSize: '1.2rem'
    }} />
    <Typography 
      variant="body2" 
      sx={{ 
        fontWeight: 500,
        color: 'primary.main'
      }}
    >
      {item.cliente.nombre} {item.cliente.apellido}
    </Typography>
  </Box>
)}
            </Box>
          </CardContent>
          <CardActions sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
  {userRole === 'ADMIN' && (
    <>
      {/* Botón Editar solo para templates */}
      {tabValue === 0 && (
        <Button
          size="small"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => {
            setTemplateEdit(item);
            setEditDialogOpen(true);
          }}
        >
          Editar
        </Button>
      )}
      
      {/* Botón Eliminar para ambas pestañas */}
      <Button
        size="small"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => tabValue === 0 ? eliminarTemplate(item.id) : eliminarRutina(item.id)}
      >
        Eliminar
      </Button>
    </>
  )}
</CardActions>
        </Card>
      </Grid>
    ))
  )}
</Grid>

{tabValue === 1 && (
  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
    <Button 
      disabled={paginaActual === 1} 
      onClick={() => setPaginaActual(prev => prev - 1)}
    >
      Anterior
    </Button>
    <Typography sx={{ alignSelf: 'center' }}>
      Página {paginaActual} de {totalPaginas}
    </Typography>
    <Button 
      disabled={paginaActual === totalPaginas} 
      onClick={() => setPaginaActual(prev => prev + 1)}
    >
      Siguiente
    </Button>
  </Box>
)}


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
            <FormControl fullWidth sx={{ mb: 2 }}>
  <Typography variant="subtitle1" sx={{ mb: 1 }}>Descripción</Typography>
  <ReactQuill 
    value={nuevaRutina.descripcion}
    onChange={(content) => setNuevaRutina({...nuevaRutina, descripcion: content})}
    style={{ height: '200px', marginBottom: '50px' }}
    modules={{
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
      ]
    }}
  />
</FormControl>
            <TextField 
  fullWidth
  margin="normal"
  label="URL de Imagen" 
  value={nuevaRutina.imagenUrl}
  onChange={e => setNuevaRutina({...nuevaRutina, imagenUrl: e.target.value})}
  helperText="Ingresa la URL de una imagen (ejemplo: https://ejemplo.com/imagen.jpg)"
/>

{/* Vista previa de la imagen */}
{nuevaRutina.imagenUrl && (
  <Box sx={{ mt: 2, mb: 2 }}>
    <img 
      src={nuevaRutina.imagenUrl} 
      alt="Vista previa"
      style={{ 
        maxWidth: '100%', 
        maxHeight: '200px', 
        objectFit: 'cover',
        borderRadius: '8px'
      }}
      onError={(e) => {
        e.target.src = '/images/default-routine.jpg';
        e.target.onerror = null;
      }}
    />
  </Box>
)}

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

{/* Nuevo diálogo para editar template */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
  <DialogTitle>Editar Template</DialogTitle>
  <DialogContent>
    <form onSubmit={actualizarTemplate}>
      <TextField 
        fullWidth
        margin="normal"
        label="Nombre" 
        value={templateEdit?.nombre || ''}
        onChange={e => setTemplateEdit({...templateEdit, nombre: e.target.value})}
      />
      <ReactQuill 
        value={templateEdit?.descripcion || ''}
        onChange={(content) => setTemplateEdit({...templateEdit, descripcion: content})}
        style={{ height: '200px', marginBottom: '50px' }}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
          ]
        }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Nivel</InputLabel>
        <Select
          value={templateEdit?.nivel || ''}
          onChange={e => setTemplateEdit({...templateEdit, nivel: e.target.value})}
        >
          <MenuItem value="PRINCIPIANTE">Principiante</MenuItem>
          <MenuItem value="INTERMEDIO">Intermedio</MenuItem>
          <MenuItem value="AVANZADO">Avanzado</MenuItem>
        </Select>
      </FormControl>
      <DialogActions>
        <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
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