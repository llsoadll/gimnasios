import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Dialog, TextField, FormControl, Select, MenuItem,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Box, Typography, Switch
} from '@mui/material';
import api from '../utils/axios';
import moment from 'moment';

const Profesores = () => {
  const [profesores, setProfesores] = useState([]);
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
    tipo: 'ENTRENADOR',
    activo: true
  });
  const [usuarioEdit, setUsuarioEdit] = useState({
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    tipo: 'ENTRENADOR'
  });

  useEffect(() => {
    const fetchProfesores = async () => {
      setLoading(true);
      try {
        const response = await api.get('/usuarios', {
          params: { tipo: 'ENTRENADOR' }
        });
        setProfesores(response.data.filter(usuario => usuario.tipo === 'ENTRENADOR'));
      } catch (err) {
        setError('Error al cargar profesores');
      } finally {
        setLoading(false);
      }
    };
    fetchProfesores();
  }, []);

  const handleEditClick = (profesor) => {
    const fecha = moment.utc(profesor.fechaNacimiento);
    const fechaAjustada = fecha.subtract(1, 'months');
    const profesorConFechaFormateada = {
      ...profesor,
      fechaNacimiento: fechaAjustada.format('YYYY-MM-DD')
    };
    setUsuarioEdit(profesorConFechaFormateada);
    setEditDialog(true);
  };
  
  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este profesor?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        setProfesores(profesores.filter(profesor => profesor.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar profesor');
      }
    }
  };
  
  const toggleEstado = async (id, estadoActual) => {
    try {
      const response = await api.patch(`/usuarios/${id}/estado?activo=${!estadoActual}`);
      if (response.status === 200) {
        setProfesores(prevProfesores => 
          prevProfesores.map(profesor => 
            profesor.id === id 
              ? { ...profesor, activo: !estadoActual }
              : profesor
          )
        );
      }
    } catch (err) {
      setError(err.response?.data || 'Error al cambiar el estado del profesor');
    }
  };
  
  const actualizarUsuario = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/usuarios/${usuarioEdit.id}`, usuarioEdit);
      const response = await api.get('/usuarios', {
        params: { tipo: 'ENTRENADOR' }
      });
      setProfesores(response.data.filter(usuario => usuario.tipo === 'ENTRENADOR'));
      setEditDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar profesor');
    }
  };
  
  const agregarProfesor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/usuarios', nuevoUsuario);
      setProfesores([...profesores, response.data]);
      alert(`Profesor creado exitosamente!\n
             Email: ${response.data.email}\n
             Contraseña: ${response.data.password}`);
      setOpenDialog(false);
      setNuevoUsuario({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        tipo: 'ENTRENADOR',
        activo: true
      });
    } catch (err) {
      setError(`Error al crear profesor: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const profesoresFiltrados = profesores
  .filter(profesor => 
    searchTerm ? (
      profesor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profesor.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profesor.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true
  )
  .slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

const totalPaginas = Math.ceil(profesores.length / itemsPorPagina);

  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Buscar profesor"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          placeholder="Buscar por nombre, email..."
        />
        <Button 
          variant="contained" 
          onClick={() => setOpenDialog(true)}
          sx={{ ml: 'auto' }}
        >
          Nuevo Profesor
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
      {profesoresFiltrados.map(profesor => (
        <TableRow key={profesor.id}>
          <TableCell>{`${profesor.nombre} ${profesor.apellido}`}</TableCell>
          <TableCell>{profesor.email}</TableCell>
          <TableCell>
            <Switch
              checked={profesor.activo}
              onChange={() => toggleEstado(profesor.id, profesor.activo)}
            />
            {profesor.activo ? 'Activo' : 'Inactivo'}
          </TableCell>
          <TableCell>
            <Button 
              variant="contained"
              color="error"
              size="small"
              onClick={() => eliminarUsuario(profesor.id)}
              sx={{ mr: 1 }}
            >
              Eliminar
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleEditClick(profesor)}
            >
              Modificar
            </Button>
          </TableCell>
          <TableCell>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate(`/usuarios/${profesor.id}/detalle`)}
              >
                Ver Detalle
              </Button>
            </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>Nuevo Profesor</DialogTitle>
      <DialogContent>
        <form onSubmit={agregarProfesor}>
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
            type="date"
            label="Fecha de Nacimiento"
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

    {/* Dialog for edit professor */}
    <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
      <DialogTitle>Modificar Profesor</DialogTitle>
      <DialogContent>
        <form onSubmit={actualizarUsuario}>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            value={usuarioEdit.nombre}
            onChange={e => setUsuarioEdit({...usuarioEdit, nombre: e.target.value})}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Apellido"
            value={usuarioEdit.apellido}
            onChange={e => setUsuarioEdit({...usuarioEdit, apellido: e.target.value})}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={usuarioEdit.email}
            onChange={e => setUsuarioEdit({...usuarioEdit, email: e.target.value})}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Teléfono"
            value={usuarioEdit.telefono}
            onChange={e => setUsuarioEdit({...usuarioEdit, telefono: e.target.value})}
          />
          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="Fecha de Nacimiento"
            value={usuarioEdit.fechaNacimiento}
            onChange={e => setUsuarioEdit({...usuarioEdit, fechaNacimiento: e.target.value})}
            InputLabelProps={{ shrink: true }}
          />
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Guardar</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
    </Box>
  );
};

export default Profesores;