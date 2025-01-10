import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Dialog, TextField, FormControl, Select, MenuItem,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Box, Typography, Switch, InputLabel
} from '@mui/material';
import api from '../utils/axios';
import moment from 'moment';
import { PeopleAlt } from '@mui/icons-material';


const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [editDialog, setEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [itemsPorPagina] = useState(10);
const [paginaActual, setPaginaActual] = useState(1);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    tipo: 'CLIENTE',
    activo: true
  });
const [usuarioEdit, setUsuarioEdit] = useState({
  id: '',
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  tipo: ''
});

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      try {
        // Update endpoint to filter by CLIENTE type
        const response = await api.get('/usuarios', {
          params: {
            tipo: 'CLIENTE'
          }
        });
        console.log('Clientes response:', response.data); // Debug log
        // Filter only CLIENTE type users
        const soloClientes = response.data.filter(usuario => usuario.tipo === 'CLIENTE');
        setClientes(soloClientes);
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error al cargar clientes';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);


  const [filterEstado, setFilterEstado] = useState('');

const clientesFiltrados = clientes
  .filter(cliente => {
    const matchSearch = searchTerm === '' || 
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchEstado = filterEstado === '' || 
      cliente.activo === (filterEstado === 'true');
      
    return matchSearch && matchEstado;
  })
  .slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  const totalPaginas = Math.ceil(clientes.length / itemsPorPagina);

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este cliente?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        setClientes(clientes.filter(cliente => cliente.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar cliente');
      }
    }
  };

  const agregarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/usuarios', nuevoUsuario);
      setClientes([...clientes, response.data]);
      alert(`Cliente creado exitosamente!\n
             Email: ${response.data.email}\n
             Contraseña: ${response.data.password}`);
      setOpenDialog(false);
      setNuevoUsuario({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        tipo: 'CLIENTE',
        activo: true
      });
    } catch (err) {
      setError(`Error al crear cliente: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (cliente) => {
    const fecha = moment.utc(cliente.fechaNacimiento);
    const fechaAjustada = fecha.subtract(1, 'months');
    const clienteConFechaFormateada = {
      ...cliente,
      fechaNacimiento: fechaAjustada.format('YYYY-MM-DD')
    };
    setUsuarioEdit(clienteConFechaFormateada);
    setEditDialog(true);
  };
  
  const actualizarUsuario = async (e) => {
    e.preventDefault();
    try {
      // Enviar la fecha sin transformaciones
      await api.put(`/usuarios/${usuarioEdit.id}`, usuarioEdit);
      
      const response = await api.get('/usuarios', {
        params: { tipo: 'CLIENTE' }
      });
      setClientes(response.data.filter(usuario => usuario.tipo === 'CLIENTE'));
      setEditDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const response = await api.patch(`/usuarios/${id}/estado?activo=${!estadoActual}`);
      if (response.status === 200) {
        setClientes(prevClientes => 
          prevClientes.map(cliente => 
            cliente.id === id 
              ? { ...cliente, activo: !estadoActual }
              : cliente
          )
        );
      }
    } catch (err) {
      setError(err.response?.data || 'Error al cambiar el estado del cliente');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.toString()}</Alert>;

  return (
    <Box>
    {error && <Alert severity="error">{error}</Alert>}
    
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid #1976d2', pb: 2 }}>
  <PeopleAlt 
    sx={{ 
      fontSize: 35, // Reduced from 45
      mr: 2, 
      color: 'primary.main',
      transform: 'rotate(-15deg)', // Added initial rotation
      transition: 'all 0.3s ease', // Added transition
      '&:hover': {
        transform: 'rotate(0deg) scale(1.1)' // Added hover effect
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
    Listado de Clientes
  </Typography>
</Box>


<Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
  <TextField
    label="Buscar cliente"
    variant="outlined"
    size="small"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    sx={{ width: 300 }}
    placeholder="Buscar por nombre, email..."
  />
  <FormControl size="small" sx={{ minWidth: 200 }}>
    <InputLabel>Estado</InputLabel>
    <Select
      value={filterEstado || ''}
      onChange={(e) => setFilterEstado(e.target.value)}
      label="Estado"
    >
      <MenuItem value="">Todos</MenuItem>
      <MenuItem value="true">Activos</MenuItem>
      <MenuItem value="false">Inactivos</MenuItem>
    </Select>
  </FormControl>
  <Button 
    variant="contained" 
    onClick={() => setOpenDialog(true)}
    sx={{ ml: 'auto' }}
  >
    Nuevo Cliente
  </Button>
</Box>

    
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
              <TableCell>Detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {clientesFiltrados.map(cliente => (
    <TableRow key={cliente.id}>
      <TableCell>{`${cliente.nombre} ${cliente.apellido}`}</TableCell>
      <TableCell>{cliente.email}</TableCell>
      <TableCell>
        <Switch
          checked={cliente.activo}
          onChange={() => toggleEstado(cliente.id, cliente.activo)}
        />
      </TableCell>
      <TableCell>
        <Button 
          variant="contained"
          color="error"
          size="small"
          onClick={() => eliminarUsuario(cliente.id)}
          sx={{ mr: 1 }}
        >
          Eliminar
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleEditClick(cliente)}
        >
          Modificar
        </Button>
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/usuarios/${cliente.id}/detalle`)}
        >
          Ver Detalle
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
      </TableContainer>

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


      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
  <DialogTitle>Modificar Cliente</DialogTitle>
  <DialogContent>
    <form onSubmit={actualizarUsuario}>
      <TextField
        fullWidth
        margin="normal"
        label="Nombre"
        value={usuarioEdit.nombre}
        onChange={(e) => setUsuarioEdit({...usuarioEdit, nombre: e.target.value})}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Apellido"
        value={usuarioEdit.apellido}
        onChange={(e) => setUsuarioEdit({...usuarioEdit, apellido: e.target.value})}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        value={usuarioEdit.email}
        onChange={(e) => setUsuarioEdit({...usuarioEdit, email: e.target.value})}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Teléfono"
        value={usuarioEdit.telefono}
        onChange={(e) => setUsuarioEdit({...usuarioEdit, telefono: e.target.value})}
      />
      <TextField
        fullWidth
        margin="normal"
        type="date"
        label="Fecha de Nacimiento"
        value={usuarioEdit.fechaNacimiento}
        onChange={(e) => setUsuarioEdit({...usuarioEdit, fechaNacimiento: e.target.value})}
        InputLabelProps={{ shrink: true }}
      />
      <DialogActions>
        <Button onClick={() => setEditDialog(false)}>Cancelar</Button>
        <Button type="submit" variant="contained">Guardar</Button>
      </DialogActions>
    </form>
  </DialogContent>
</Dialog>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <DialogContent>
          <form onSubmit={agregarCliente}>
            <TextField 
              fullWidth
              margin="normal"
              label="Nombre" 
              value={nuevoUsuario.nombre}
              onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Apellido" 
              value={nuevoUsuario.apellido}
              onChange={e => setNuevoUsuario({...nuevoUsuario, apellido: e.target.value})}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Email" 
              type="email"
              value={nuevoUsuario.email}
              onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Teléfono"
              value={nuevoUsuario.telefono}
              onChange={e => setNuevoUsuario({...nuevoUsuario, telefono: e.target.value})}
            />
            <TextField 
              fullWidth
              margin="normal"
              label="Fecha de Nacimiento"
              type="date"
              value={nuevoUsuario.fechaNacimiento}
              onChange={e => setNuevoUsuario({...nuevoUsuario, fechaNacimiento: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button type="submit" variant="contained">Guardar</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Clientes;