import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Collapse } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
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
  zIndex: theme.zIndex.drawer + 1,
  background: 'linear-gradient(90deg, #1a237e 0%, #283593 100%)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  '& .MuiToolbar-root': {
    height: { xs: '60px', sm: '70px' },
    padding: { xs: '0 16px', sm: '0 24px' },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& .user-section': {
      display: 'flex',
      alignItems: 'center',
      gap: { xs: '12px', sm: '24px' },
      '& .user-info': {
        display: { xs: 'none', sm: 'flex' }, // Ocultar info en móviles
        flexDirection: 'column',
        alignItems: 'flex-end',
        '& .MuiTypography-subtitle2': {
          color: 'white',
          fontWeight: 500,
          fontSize: { xs: '0.8rem', sm: '1rem' }
        },
        '& .MuiTypography-caption': {
          color: 'rgba(255,255,255,0.7)',
          fontSize: { xs: '0.7rem', sm: '0.8rem' }
        }
      },
      '& .logout-button': {
  marginLeft: '12px', 
  borderRadius: '20px',
  backgroundColor: 'rgba(255,255,255,0.15)',
  padding: { xs: '2px 4px', sm: '8px 16px' }, // Reducir padding en móviles
  minWidth: { xs: '32px', sm: '120px' }, // Reducir ancho mínimo en móviles
  '& .MuiButton-startIcon': {
    margin: { xs: 0, sm: '8px' },
    '& svg': {  // Ajustar tamaño del ícono
      fontSize: { xs: '1.2rem', sm: '1.5rem' }
    }
  },
  '& .MuiButton-label': {
    display: { xs: 'none', sm: 'block' }
  },
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.25)',
    transform: 'translateY(-2px)'
  },
  transition: 'all 0.3s ease'
}
    }
  }
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)', // Coincide con el AppBar
    color: 'white',
    width: drawerWidth,
    padding: '10px',
    
    '& .MuiListItem-root': {
      margin: '8px 0',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.12)',
        transform: 'translateX(5px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      },
      
      '&.Mui-selected': {
        backgroundColor: 'rgba(255,255,255,0.18)',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.22)'
        }
      }
    },
    
    // Estilo para los submenús
    '& .MuiCollapse-root': {
      '& .MuiList-root': {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: '8px',
        margin: '0 10px',
        
        '& .MuiListItem-root': {
          margin: '4px 0',
          paddingLeft: '32px',
          borderRadius: '8px',
          
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'translateX(0px)'
          }
        }
      }
    },
    
    // Estilo para los textos
    '& .MuiListItemText-root': {
      '& .MuiTypography-root': {
        fontWeight: 500,
        fontSize: '0.95rem',
        letterSpacing: '0.5px'
      }
    },
    
    // Estilo para los iconos de expandir
    '& .MuiSvgIcon-root': {
      transition: 'transform 0.3s ease',
      '&.expanded': {
        transform: 'rotate(180deg)'
      }
    }
  }
}));

const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8), // Aumentar el margen superior
  marginLeft: { xs: 0, sm: `${drawerWidth}px` }, // Responsive margin
  padding: theme.spacing(3),
  width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` }, // Responsive width
  maxWidth: 'none', // Quitar el maxWidth por defecto de Container
  transition: 'margin 0.3s ease', // Suave transición
}));

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [membresia, setMembresia] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState('');
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (text) => {
    setExpandedMenu(expandedMenu === text ? '' : text);
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
    if (userRole === 'CLIENTE' && userId) {
      console.log('Buscando membresía para cliente:', userId);
      const response = await api.get(`/usuarios/${userId}/detalle`);
      console.log('Respuesta detalle:', response.data);
      
      if (response.data.membresias && response.data.membresias.length > 0) {
        const membresiaActiva = response.data.membresias
          .filter(m => {
            const fechaFin = Array.isArray(m.fechaFin) ? 
              moment([m.fechaFin[0], m.fechaFin[1], m.fechaFin[2]]) : 
              moment(m.fechaFin);
            return m.activa && fechaFin.isAfter(moment());
          })
          .sort((a, b) => {
            const fechaFinA = Array.isArray(a.fechaFin) ? 
              moment([a.fechaFin[0], a.fechaFin[1], a.fechaFin[2]]) : 
              moment(a.fechaFin);
            const fechaFinB = Array.isArray(b.fechaFin) ? 
              moment([b.fechaFin[0], b.fechaFin[1], b.fechaFin[2]]) : 
              moment(b.fechaFin);
            return fechaFinB.diff(fechaFinA);
          })[0];
        
        console.log('Membresía activa encontrada:', membresiaActiva);
        if (membresiaActiva) {
          setMembresia(membresiaActiva);
        }
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
  
    if (userRole === 'ADMIN') {
      return [
        { 
          text: 'Usuarios',
          subItems: [
            { text: 'Clientes', path: '/usuarios/clientes' },
            { text: 'Profesores', path: '/usuarios/profesores' }
          ]
        },
        { text: 'Membresías', path: '/membresias' },
        { text: 'Pagos', path: '/pagos' },
        { text: 'Caja', path: '/caja' },
        ...commonItems
      ];
    } else if (userRole === 'ENTRENADOR') {
      return commonItems;
    } else {
      return [
        { text: 'Dashboard', path: '/dashboard' },
        ...commonItems
      ];
    }
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
    <IconButton color="inherit" onClick={handleDrawerToggle}>
      <MenuIcon />
    </IconButton>
  )}
  
  <Box sx={{ 
  flexGrow: 1, 
  display: 'flex', 
  alignItems: 'center',
  mt: { xs: 1, sm: 2 },
  mb: 2
}}>
  <Box
    component="img"
    src="/images/logo.png"
    alt="Logo Gimnasio"
    sx={{
      height: 'auto',
      width: 'auto',
      maxHeight: { 
        xs: '130px',    // Más pequeño en móvil
        sm: '150px',    // Tamaño medio en tablet
        md: '250px'     // Tamaño completo en desktop
      },
      maxWidth: { 
        xs: '150px',   // Más pequeño en móvil
        sm: '200px',   // Tamaño medio en tablet
        md: '300px'    // Tamaño completo en desktop
      },
      marginRight: 2,
      objectFit: 'contain',
      transition: 'all 0.3s ease' // Suavizar la transición
    }}
  />
</Box>

  <Box className="user-section">
    {userRole === 'CLIENTE' && membresia && (
      <Box className="user-info">
        <Typography variant="body2">
          Membresía {membresia.tipo}
        </Typography>
        <Typography variant="caption">
          Vence: {new Date(membresia.fechaFin).toLocaleDateString('es-AR')}
        </Typography>
      </Box>
    )}
    
    {usuario && (
      <Box className="user-info">
        <Typography variant="subtitle2">
          {usuario.nombre} {usuario.apellido}
        </Typography>
        <Typography variant="caption">
          {userRole.toLowerCase()}
        </Typography>
      </Box>
    )}

    <Button 
      className="logout-button"
      color="inherit"
      onClick={handleLogout}
      startIcon={<LogoutIcon />}
    >
      Cerrar Sesión
    </Button>
  </Box>
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
        item.subItems ? (
          <div key={item.text}>
            <ListItem 
              button 
              onClick={() => handleMenuClick(item.text)}
            >
              <ListItemText primary={item.text} />
              {expandedMenu === item.text ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={expandedMenu === item.text} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.subItems.map(subItem => (
                  <ListItem
                    button
                    key={subItem.text}
                    onClick={() => {
                      navigate(subItem.path);
                      if (isMobile) setMobileOpen(false);
                    }}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary={subItem.text} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
      </div>
    ) : (
      <ListItem
        button
        key={item.text}
        onClick={() => {
          navigate(item.path);
          if (isMobile) setMobileOpen(false);
        }}
      >
        <ListItemText primary={item.text} />
      </ListItem>
    )
  ))}
</List>
      </StyledDrawer>

      <Box component="main" sx={{ 
  flexGrow: 1,
  p: { xs: 2, sm: 3 },  // Padding general más pequeño
  pl: { sm: 6 }, // Padding izquierdo específico para tamaños sm y superiores
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
  marginLeft: { xs: 0, sm: `${drawerWidth}px` },
  width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
  transition: 'margin 0.3s ease',
  paddingTop: '76px',
  '& > *:first-child': {
    marginTop: 2
  }
}}>
  <Toolbar />
  {children}
      </Box>
    </Box>
  );
};

export default Layout;