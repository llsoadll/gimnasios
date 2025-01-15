import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, CardMedia, Typography, Button,
  TextField, Dialog, Box, FormControl, Select, MenuItem, DialogTitle, DialogContent, DialogActions, InputLabel, CardActions
} from '@mui/material';
import api from '../utils/axios';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategoria, setFilterCategoria] = useState('');
    const userRole = localStorage.getItem('userRole'); 
    const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [openDialog, setOpenDialog] = useState(false);
const [ventaDialogOpen, setVentaDialogOpen] = useState(false);
const [productoSeleccionado, setProductoSeleccionado] = useState(null);
const [nuevoProducto, setNuevoProducto] = useState({
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoria: '',
  imagen: ''
});

// Filtrar productos según búsqueda y categoría
const productosFiltrados = productos.filter(producto => {
  const matchSearch = searchTerm === '' || 
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchCategoria = filterCategoria === '' || 
    producto.categoria === filterCategoria;
  
  return matchSearch && matchCategoria;
});


// Función para cargar productos
useEffect(() => {
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/productos');
      setProductos(response.data);
    } catch (err) {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };
  fetchProductos();
}, []);

// Función para agregar nuevo producto
const agregarProducto = async (e) => {
  e.preventDefault();
  try {
    const productoData = {
      ...nuevoProducto,
      precio: parseFloat(nuevoProducto.precio),
      stock: parseInt(nuevoProducto.stock)
    };
    
    const response = await api.post('/productos', productoData);
    setProductos([...productos, response.data]);
    setOpenDialog(false);
    setNuevoProducto({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria: '',
      imagen: ''
    });
  } catch (err) {
    setError('Error al crear producto');
    console.error('Error:', err);
  }
};


const eliminarProducto = async (id) => {
  if (window.confirm('¿Está seguro de eliminar este producto?')) {
    try {
      await api.delete(`/productos/${id}`);
      setProductos(productos.filter(producto => producto.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError('Error al eliminar el producto');
    }
  }
};

// Función para vender producto
const handleVenta = async (producto) => {
  try {
    await api.post(`/productos/${producto.id}/venta`);
    // Actualizar lista de productos
    const updatedProductos = productos.map(p => 
      p.id === producto.id ? {...p, stock: p.stock - 1} : p
    );
    setProductos(updatedProductos);
  } catch (err) {
    setError('Error al realizar la venta');
  }
};

const handleVentaClick = (producto) => {
  setProductoSeleccionado(producto);
  setVentaDialogOpen(true);
};


const getImageUrl = (imagen) => {
  return imagen?.startsWith('http') 
    ? imagen 
    : `${process.env.REACT_APP_API_URL}/images/${imagen}`;
};

const confirmarVenta = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const response = await api.post(`/productos/${productoSeleccionado.id}/venta`, {
      userId: parseInt(userId),
      metodoPago: 'EFECTIVO' // Podrías agregar un select para elegir el método
    });
    
    const updatedProductos = productos.map(p => 
      p.id === productoSeleccionado.id ? response.data : p
    );
    setProductos(updatedProductos);
    setVentaDialogOpen(false);
    setProductoSeleccionado(null);
  } catch (err) {
    console.error('Error:', err);
    setError('Error al realizar la venta');
  }
};
    
    return (
        <>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3 
          }}>
          <TextField
            label="Buscar producto"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: '100%', sm: 300 } }}
          />
          
          <FormControl size="small" sx={{ width: { xs: '100%', sm: 200 } }}>
            <Select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              label="Categoría"
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="BEBIDAS">Bebidas</MenuItem>
              <MenuItem value="SUPLEMENTOS">Suplementos</MenuItem>
            </Select>
          </FormControl>
          
          {userRole === 'ADMIN' && (
            <Button 
            variant="contained"
            onClick={() => setOpenDialog(true)}
            sx={{ 
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Nuevo Producto
          </Button>
          )}
        </Box>
  
        <Grid container spacing={3}>
        {productosFiltrados.map(producto => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={producto.imagen}
                  alt={producto.nombre}
                />
                <CardContent>
                  <Typography variant="h6">{producto.nombre}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {producto.descripcion}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${producto.precio}
                  </Typography>
                  <Typography variant="caption">
                    Stock: {producto.stock}
                  </Typography>
                  <CardActions sx={{ mt: 'auto', justifyContent: 'flex-end', gap: 1 }}>
    <Button 
      size="small"
      variant="contained"
      onClick={() => handleVentaClick(producto)}
      disabled={producto.stock <= 0}
    >
      Vender
    </Button>

    {userRole === 'ADMIN' && (
      <Button 
        size="small"
        variant="contained"
        color="error"
        onClick={() => eliminarProducto(producto.id)}
      >
        Eliminar
      </Button>
    )}
  </CardActions>
                </CardContent>
              </Card>

              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>Nuevo Producto</DialogTitle>
  <form onSubmit={agregarProducto}> {/* Mover el form aquí para envolver todo */}
    <DialogContent>
      <TextField
        fullWidth
        margin="normal"
        label="Nombre"
        required
        value={nuevoProducto.nombre}
        onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Descripción"
        value={nuevoProducto.descripcion}
        onChange={e => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Precio"
        type="number"
        required
        value={nuevoProducto.precio}
        onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Stock"
        type="number"
        required
        value={nuevoProducto.stock}
        onChange={e => setNuevoProducto({...nuevoProducto, stock: e.target.value})}
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Categoría</InputLabel>
        <Select
          value={nuevoProducto.categoria}
          onChange={e => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
        >
          <MenuItem value="BEBIDAS">Bebidas</MenuItem>
          <MenuItem value="SUPLEMENTOS">Suplementos</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="URL Imagen"
        value={nuevoProducto.imagen}
        onChange={e => setNuevoProducto({...nuevoProducto, imagen: e.target.value})}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
      <Button type="submit" variant="contained" color="primary">
        Guardar
      </Button>
    </DialogActions>
  </form>
</Dialog>

<Dialog open={ventaDialogOpen} onClose={() => setVentaDialogOpen(false)}>
  <DialogTitle>Confirmar Venta</DialogTitle>  
  <DialogContent>
    {productoSeleccionado && (
      <>
        <Typography>¿Está seguro de vender este producto?</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Producto:</strong> {productoSeleccionado.nombre}</Typography>
          <Typography><strong>Precio:</strong> ${productoSeleccionado.precio}</Typography>
        </Box>
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setVentaDialogOpen(false)}>Cancelar</Button>
    <Button 
      onClick={confirmarVenta} 
      variant="contained" 
      color="primary"
      type="button"
    >
      Confirmar Venta
    </Button>
  </DialogActions>
</Dialog>

            </Grid>
          ))}
        </Grid>
      </>
    );
  };
  export default Productos;