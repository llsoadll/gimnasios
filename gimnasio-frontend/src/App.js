import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Usuarios from './pages/Usuarios';
import Membresias from './pages/Membresias';
import Rutinas from './pages/Rutinas';
import Clases from './pages/Clases';
import Seguimientos from './pages/Seguimientos';
import Pagos from './pages/Pagos';
import DetalleCliente from './pages/DetalleCliente';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Caja from './pages/Caja';
import Clientes from './pages/Clientes';
import Profesores from './pages/Profesores';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }
      }
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      letterSpacing: '0.5px'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Las rutas más específicas primero */}
            <Route path="/usuarios/clientes" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Clientes />
              </ProtectedRoute>
            } />
            
            <Route path="/usuarios/profesores" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Profesores />
              </ProtectedRoute>
            } />
            
            <Route path="/usuarios/:id/detalle" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DetalleCliente />
              </ProtectedRoute>
            } />
            
            {/* Rutas generales después */}
            <Route path="/usuarios" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Usuarios />
              </ProtectedRoute>
            } />
            
            <Route path="/membresias" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Membresias />
              </ProtectedRoute>
            } />
            
            <Route path="/rutinas" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'CLIENTE']}>
                <Rutinas />
              </ProtectedRoute>
            } />

<Route path="/clases" element={
  <ProtectedRoute allowedRoles={['ADMIN', 'CLIENTE']}>
    <Clases />
  </ProtectedRoute>
} />
            
            <Route path="/seguimientos" element={
  <ProtectedRoute allowedRoles={['ADMIN', 'CLIENTE']}>
    <Seguimientos />
  </ProtectedRoute>
} />
            
            <Route path="/pagos" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Pagos />
              </ProtectedRoute>
            } />
            
            <Route path="/caja" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Caja />
              </ProtectedRoute>
            } />
            
            {/* Ruta por defecto */}
            {/* Cambiar ruta por defecto según el rol */}
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'CLIENTE']}>
                {localStorage.getItem('userRole') === 'ADMIN' ? 
                  <Clientes /> : 
                  <Clases />
                }
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;