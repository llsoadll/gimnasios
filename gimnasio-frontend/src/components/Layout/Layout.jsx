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
  ListItemText,
  CssBaseline,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';

const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  '& .MuiPaper-root': {
    borderRadius: '12px',
    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
    }
  },
  '& .MuiButton-root': {
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }
  },
  '& .MuiTableContainer-root': {
    '& .MuiTableHead-root': {
      '& .MuiTableCell-head': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        fontWeight: 600
      }
    },
    '& .MuiTableRow-root': {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'
      }
    }
  }
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
  boxShadow: 'none'
}));

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
      <CssBaseline />
      <StyledAppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Gestión de Gimnasio
          </Typography>
          {userRole === 'CLIENTE' && membresia && (
  <Box sx={{ mr: 2 }}>
    <Typography 
      variant="subtitle2" 
      color={membresia.fechaFin && moment(Array.isArray(membresia.fechaFin) ? 
        membresia.fechaFin : moment(membresia.fechaFin)).isBefore(moment()) ? 'error' : 'inherit'}
    >
      Membresía {membresia.tipo}
      {membresia.fechaFin ? (
        Array.isArray(membresia.fechaFin) && 
        moment([membresia.fechaFin[0], membresia.fechaFin[1] - 1, membresia.fechaFin[2]]).isBefore(moment()) ? 
          ' - VENCIDA' :
          ` - Vence: ${Array.isArray(membresia.fechaFin) ? 
            moment([membresia.fechaFin[0], membresia.fechaFin[1] - 1, membresia.fechaFin[2]]).format('DD/MM/YYYY') :
            moment(membresia.fechaFin).format('DD/MM/YYYY')}`
      ) : ''}
    </Typography>
  </Box>
)}
          <Button color="inherit" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
        </StyledAppBar>
        <Drawer
  variant="permanent"
  sx={{
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      background: 'linear-gradient(180deg, #1976d2 0%, #2196f3 100%)',
      color: 'white',
      borderRight: 'none',
      boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      '& .MuiListItem-root': {
        margin: '8px 16px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          transform: 'translateX(5px)'
        }
      },
      '& .MuiListItemIcon-root': {
        color: 'white',
        minWidth: '40px'
      },
      '& .MuiListItemText-primary': {
        fontSize: '0.95rem',
        fontWeight: 500
      },
      '& .MuiDivider-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.12)'
      }
    }
  }}
>
        <Toolbar />
        <List sx={{ mt: 4 }}>
          {getMenuItems().map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigate(item.path)}
              sx={{
                margin: '8px 16px',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.1)'
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <MainContainer maxWidth="xl">
          {children}
        </MainContainer>
      </Box>
    </Box>
  );
};

export default Layout;