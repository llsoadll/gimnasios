// src/components/Layout/Layout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText 
} from '@mui/material';
import api from '../../utils/axios';
import moment from 'moment';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [membresia, setMembresia] = useState(null);
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');
  const drawerWidth = 240;

  const fetchMembresia = async () => {
    try {
      const response = await api.get(`/usuarios/${userId}/membresia-activa`);
      if (response.data) {
        console.log('Fecha fin recibida:', response.data.fechaFin); // Para debug
        setMembresia(response.data);
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
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Gestión de Gimnasio
          </Typography>
          {userRole === 'CLIENTE' && membresia && (
  <Box sx={{ mr: 2 }}>
    <Typography variant="subtitle2">
      Membresía {membresia.tipo}
      {` - Vence: ${moment(membresia.fechaFin, 'YYYY-MM-DD').format('DD/MM/YYYY')}`}
    </Typography>
  </Box>
)}
          <Button color="inherit" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List sx={{ mt: 4 }}>
          {getMenuItems().map((item) => (
            <ListItem button key={item.text} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;