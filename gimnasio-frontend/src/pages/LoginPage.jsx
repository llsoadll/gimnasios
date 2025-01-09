import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Container, Typography, Alert } from '@mui/material';
import api from '../utils/axios';

const LoginPage = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
      email: '',
      password: ''
    });
    const [error, setError] = useState(null);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          console.log('Intentando login con:', credentials);
          const response = await api.post('/auth/login', credentials);
          
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userRole', response.data.role);
          localStorage.setItem('userId', response.data.id);
          
          // Redirect based on role
          if (response.data.role === 'ADMIN') {
            navigate('/usuarios/clientes'); 
          } else if (response.data.role === 'CLIENTE') {
            navigate('/dashboard');
          } else {
            navigate('/rutinas');
          }
        } catch (err) {
          console.error('Error de login:', err);
          // Extraer el mensaje de error de la respuesta
          const errorMessage = err.response?.data?.message || 
                             err.response?.data || 
                             'Error de autenticación';
          setError(typeof errorMessage === 'string' ? errorMessage : 'Error de autenticación');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Typography component="h1" variant="h5">
                    Iniciar Sesión
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              autoFocus
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Box>
      </Container>
    );
  };

export default LoginPage;