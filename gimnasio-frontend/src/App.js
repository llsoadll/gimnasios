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
import DashboardCliente from './pages/DashboardCliente'; 
import { Navigate } from 'react-router-dom';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';


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
  // Añadir verificación del rol
  const userRole = localStorage.getItem('userRole');
  console.log('Current user role:', userRole); // Para debug

  return (
    <ThemeProvider theme={theme}>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Ruta raíz con redirección basada en rol */}
            <Route path="/" element={
  <ProtectedRoute allowedRoles={['ADMIN', 'CLIENTE']}>
    <Navigate 
      to={userRole === 'ADMIN' ? '/usuarios/clientes' : '/dashboard'} // Cambiar '/clases' por '/dashboard'
      replace 
    />
  </ProtectedRoute>
} />

            {/* Rutas protegidas */}
            <Route path="/usuarios/clientes" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'ENTRENADOR']}>
                <Clientes />
              </ProtectedRoute>
            } />
            
            <Route path="/usuarios/profesores" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Profesores />
              </ProtectedRoute>
            } />
            
            <Route path="/usuarios/:id/detalle" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'ENTRENADOR']}>
                <DetalleCliente />
              </ProtectedRoute>
            } />
            
            <Route path="/membresias" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Membresias />
              </ProtectedRoute>
            } />

<Route path="/dashboard" element={
  <ProtectedRoute allowedRoles={['CLIENTE']}>
    <DashboardCliente />
  </ProtectedRoute>
} />
            
            <Route path="/rutinas" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'CLIENTE', 'ENTRENADOR']}>
                <Rutinas />
              </ProtectedRoute>
            } />

<Route path="/clases" element={
  <ProtectedRoute allowedRoles={['ADMIN', 'CLIENTE', 'ENTRENADOR']}>
    <Clases />
  </ProtectedRoute>
} />
            
            <Route path="/seguimientos" element={
  <ProtectedRoute allowedRoles={['ADMIN', 'CLIENTE', 'ENTRENADOR']}>
    <Seguimientos />
  </ProtectedRoute>
} />

<Route path="/productos" element={
  <ProtectedRoute allowedRoles={['ADMIN', 'CLIENTE', 'ENTRENADOR']}>
    <Productos />
  </ProtectedRoute>
} />

<Route path="/ventas" element={
  <ProtectedRoute allowedRoles={['ADMIN']}>
    <Ventas />
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
            
          </Routes>
        </Layout>
    </ThemeProvider>
  );
}

export default App;