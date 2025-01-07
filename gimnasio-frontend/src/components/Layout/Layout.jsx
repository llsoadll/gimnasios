import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  AppBar,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Container
} from '@mui/material';
import api from '../../utils/axios';
import moment from 'moment';

const drawerWidth = 240;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
  boxShadow: 'none',
  zIndex: theme.zIndex.drawer + 1
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
    color: 'white'
  }
}));

const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [membresia, setMembresia] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  
 // Función para cargar el usuario
 const fetchUsuario = async () => {
  try {
    if (userId) {
      const response = await api.get(`/usuarios/${userId}/detalle`); // Cambiar a /detalle
      console.log('Usuario cargado:', response.data);
      setUsuario(response.data);
    }
  } catch (err) {
    console.error('Error al cargar usuario:', err);
  }
};

useEffect(() => {
  const cargarDatos = async () => {
    if (userId) {
      await fetchUsuario();
    }
    if (userRole === 'CLIENTE') {
      await fetchMembresia();
    }
  };
  
  cargarDatos();
}, [userId, userRole]);

  const fetchMembresia = async () => {
    try {
      // Solo buscar membresía si es CLIENTE
      if (userRole === 'CLIENTE') {
        const response = await api.get(`/usuarios/${userId}/membresia-activa`);
        if (response.data) {
          setMembresia(response.data);
        }
      }
    } catch (err) {
      console.error('Error al cargar membresía:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getMenuItems = () => {
    const commonItems = [
      { text: 'Rutinas', path: '/rutinas' },
      { text: 'Clases', path: '/clases' },
      { text: 'Seguimientos', path: '/seguimientos' }
    ];

    const adminItems = [
      { text: 'Usuarios', path: '/usuarios' },
      { text: 'Membresías', path: '/membresias' },
      { text: 'Pagos', path: '/pagos' },
      { text: 'Caja', path: '/caja' }, 
      ...commonItems
    ];

    return userRole === 'ADMIN' ? adminItems : commonItems;
  };

  useEffect(() => {
    if (userRole === 'CLIENTE') {
      fetchMembresia();
    }
  }, [userRole, userId]);

  if (!userRole) {
    return children;
  }


  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Gestión de Gimnasio
          </Typography>
          {userRole === 'CLIENTE' && membresia && membresia.tipo && membresia.fechaFin && (
  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
    <Typography variant="body2" sx={{ mr: 1 }}>
      Membresía {membresia.tipo}
    </Typography>
    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
      (Vence: {new Date(membresia.fechaFin).toLocaleDateString('es-AR')})
    </Typography>
  </Box>
)}
{usuario && (
  <Typography variant="body2" sx={{ mr: 2, color: 'white' }}>
    {usuario.nombre} {usuario.apellido}
  </Typography>
)}
<Button color="inherit" onClick={handleLogout}>
  Cerrar Sesión
</Button>
        </Toolbar>
      </StyledAppBar>
      
      {userRole && (
        <StyledDrawer variant="permanent">
          <Toolbar />
          <List>
            {getMenuItems().map((item) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </StyledDrawer>
      )}

<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;