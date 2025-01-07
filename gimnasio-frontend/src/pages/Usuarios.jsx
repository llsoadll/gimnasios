import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Dialog, TextField, FormControl, Select, MenuItem,
  DialogTitle, DialogContent, DialogActions, Alert, CircularProgress,
  Box
} from '@mui/material';
import { Switch } from '@mui/material'; // Agregar este import
import axios from 'axios';


const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    tipo: 'CLIENTE',
    activo: true
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);


  const toggleEstado = async (id, estadoActual) => {
    try {
        console.log(`Cambiando estado de usuario ${id} a ${!estadoActual}`);
        
        const response = await axios.patch(
            `http://localhost:8080/api/usuarios/${id}/estado?activo=${!estadoActual}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (response.status === 200) {
            setUsuarios(prevUsuarios => 
                prevUsuarios.map(usuario => 
                    usuario.id === id 
                        ? { ...usuario, activo: !estadoActual }
                        : usuario
                )
            );
            console.log('Estado cambiado exitosamente');
        }
    } catch (err) {
        console.error('Error completo:', err);
        setError(err.response?.data || 'Error al cambiar el estado del usuario');
    }
};


  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/usuarios');
      // Asegurarse de que response.data es un array
      const data = Array.isArray(response.data) ? response.data : [];
      setUsuarios(data);
    } catch (err) {
      setError('Error al cargar usuarios');
      setUsuarios([]); // En caso de error, establecer array vacío
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8080/api/usuarios/${id}`);
            setUsuarios(usuarios.filter(usuario => usuario.id !== id));
        } catch (err) {
            setError(`Error al eliminar usuario: ${err.response?.data?.message || err.message}`);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }
};

const agregarUsuario = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
      const response = await axios.post('http://localhost:8080/api/usuarios', nuevoUsuario);
      setUsuarios([...usuarios, response.data]);
      alert(`Usuario creado exitosamente!\n
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
      setError(`Error al crear usuario: ${err.response?.data?.message || err.message}`);
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

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Button 
        variant="contained" 
        onClick={() => setOpenDialog(true)} 
        sx={{ 
          mb: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }
        }}
      >
        Nuevo Usuario
      </Button>

      <TableContainer 
        component={Paper}
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
              <TableCell>Detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(usuarios) && usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{`${usuario.nombre} ${usuario.apellido}`}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.tipo}</TableCell>
                <TableCell>
                  <Switch
                    checked={usuario.activo}
                    onChange={() => toggleEstado(usuario.id, usuario.activo)}
                    color="primary"
                  />
                  {usuario.activo ? 'Activo' : 'Inactivo'}
                </TableCell>
                <TableCell>
                <Button 
  variant="contained"
  color="error"
  size="small"
  onClick={() => eliminarUsuario(usuario.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
                <TableCell>
                <Button 
  color="primary"
  onClick={() => navigate(`/usuario/${usuario.id}`)}
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
        <DialogTitle>Nuevo Usuario</DialogTitle>
        <DialogContent>
          <form onSubmit={agregarUsuario}>
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
            <FormControl fullWidth margin="normal">
              <Select
                value={nuevoUsuario.tipo}
                onChange={e => setNuevoUsuario({...nuevoUsuario, tipo: e.target.value})}
              >
                <MenuItem value="CLIENTE">Cliente</MenuItem>
                <MenuItem value="ENTRENADOR">Entrenador</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Usuarios;