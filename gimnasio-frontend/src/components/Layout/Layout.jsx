// src/components/Layout/Layout.jsx
import React from 'react';
import { Box, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
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
  const navigate = useNavigate();
  const drawerWidth = 240;

  const menuItems = [
    { text: 'Usuarios', icon: <PersonOutline />, path: '/usuarios' },
    { text: 'Membresías', icon: <CardMembershipOutlined />, path: '/membresias' },
    { text: 'Rutinas', icon: <FitnessCenterOutlined />, path: '/rutinas' },
    { text: 'Clases', icon: <ClassOutlined />, path: '/clases' },
    { text: 'Seguimientos', icon: <MonitorHeartOutlined />, path: '/seguimientos' },
    { text: 'Pagos', icon: <PaymentOutlined />, path: '/pagos' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <h1>Gestión de Gimnasio</h1>
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
          {menuItems.map((item) => (
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