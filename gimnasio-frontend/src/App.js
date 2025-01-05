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


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
          <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'CLIENTE']}>
                <Usuarios />
              </ProtectedRoute>
            } />
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
            <Route 
  path="/seguimientos" 
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'CLIENTE']}>
      <Seguimientos />
    </ProtectedRoute>
  } 
/>
            <Route path="/pagos" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Pagos />
              </ProtectedRoute>
            } />
            <Route path="/usuario/:id" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DetalleCliente />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;