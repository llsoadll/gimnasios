import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Usuarios from './pages/Usuarios';
import Membresias from './pages/Membresias';
import Rutinas from './pages/Rutinas';
import Clases from './pages/Clases';

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
            <Route path="/" element={<Usuarios />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/membresias" element={<Membresias />} />
            <Route path="/rutinas" element={<Rutinas />} />
            <Route path="/clases" element={<Clases />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;