// src/components/Layout/Layout.jsx
import React from 'react';
import { Box, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  PersonOutline, 
  FitnessCenterOutlined, 
  ClassOutlined, 
  CardMembershipOutlined, 
  MonitorHeartOutlined,
  PaymentOutlined 
} from '@mui/icons-material';

const Layout = ({ children }) => {
  const handleLogout = () => {
    // Eliminar datos de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    // Redireccionar al login
    navigate('/login');
};
  const navigate = useNavigate();
  const drawerWidth = 240;
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario
  const token = localStorage.getItem('token'); // Verificar si hay un token

  // Definir los menús según el rol
  const getMenuItems = () => {
    if (!token) return []; // Si no hay token, retornar array vacío

    const commonItems = [
      { text: 'Rutinas', icon: <FitnessCenterOutlined />, path: '/rutinas' },
      { text: 'Clases', icon: <ClassOutlined />, path: '/clases' },
      { text: 'Seguimientos', icon: <MonitorHeartOutlined />, path: '/seguimientos' }
    ];

    const adminItems = [
      { text: 'Usuarios', icon: <PersonOutline />, path: '/usuarios' },
      { text: 'Membresías', icon: <CardMembershipOutlined />, path: '/membresias' },
      { text: 'Pagos', icon: <PaymentOutlined />, path: '/pagos' },
      ...commonItems
    ];

    return userRole === 'ADMIN' ? adminItems : commonItems;
  };

  // No mostrar el layout completo si no hay token
  if (!token) {
    return children;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <h1>Gestión de Gimnasio</h1>
          <Button 
                        color="inherit" 
                        onClick={handleLogout}
                        sx={{ marginLeft: 'auto' }}
                    >
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