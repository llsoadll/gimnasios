import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
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
  Container,
  IconButton,
  Paper
} from '@mui/material';
import api from '../../utils/axios';
import moment from 'moment';

const drawerWidth = 240;

const StyledButton = styled(Button)({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  }
});

const StyledCard = styled(Paper)({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
  }
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
  boxShadow: 'none',
  zIndex: theme.zIndex.drawer + 1  // Add this line to make AppBar appear above drawer
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
    color: 'white',
    '& .MuiListItem-root': {
      margin: '8px 16px',
      borderRadius: '8px',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
}));

const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginLeft: `${drawerWidth}px`, // Add margin for drawer
  width: `calc(100% - ${drawerWidth}px)` // Adjust width
}));

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [membresia, setMembresia] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
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
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
         
<Typography 
  variant="h5" 
  sx={{ 
    flexGrow: 1,
    fontSize: { 
      xs: '1.2rem',
      sm: '1.5rem',
      md: '1.8rem' 
    }
  }}
>
  Gestión de Gimnasio
</Typography>
          {userRole === 'CLIENTE' && membresia && (
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
            <Typography variant="body2" sx={{ mr: 2 }}>
              {usuario.nombre} {usuario.apellido}
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </StyledAppBar>
      
      <StyledDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
      >
        <Toolbar />
        <List>
          {getMenuItems().map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </StyledDrawer>

      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: { xs: 2, sm: 3 },
        width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
        marginLeft: { xs: 0, sm: `${drawerWidth}px` }
      }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;