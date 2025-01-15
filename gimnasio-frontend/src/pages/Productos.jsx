import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, CardMedia, Typography, Button,
  TextField, Dialog, Box, FormControl, Select, MenuItem, DialogTitle, DialogContent, DialogActions, InputLabel, CardActions
} from '@mui/material';
import { LocalMall, ShoppingCart } from '@mui/icons-material';
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
const [itemsPorPagina] = useState(9); // 9 productos por página
const [paginaActual, setPaginaActual] = useState(1);
const [clientSearchTerm, setClientSearchTerm] = useState('');
const [productoSeleccionado, setProductoSeleccionado] = useState(null);
const [nuevoProducto, setNuevoProducto] = useState({
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoria: '',
  imagen: ''
});
const [clientes, setClientes] = useState([]);
const [ventaData, setVentaData] = useState({
  clienteId: '',
  cantidad: 1,
  metodoPago: 'EFECTIVO'
});

const fetchClientes = async () => {
  try {
    const response = await api.get('/usuarios');
    setClientes(response.data.filter(u => u.tipo === 'CLIENTE'));
  } catch (err) {
    setError('Error al cargar clientes');
  }
};

useEffect(() => {
  fetchClientes();
}, []);

// Filtrar productos según búsqueda y categoría
const productosFiltrados = productos.filter(producto => {
  const matchSearch = searchTerm === '' || 
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchCategoria = filterCategoria === '' || 
    producto.categoria === filterCategoria;
  
  return matchSearch && matchCategoria;
});

const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / itemsPorPagina));

const productosAPaginar = productosFiltrados.slice(
  (paginaActual - 1) * itemsPorPagina,
  paginaActual * itemsPorPagina
);


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
    const ventaPayload = {
      userId: ventaData.clienteId,
      cantidad: Number(ventaData.cantidad), // Asegurar que sea número
      metodoPago: ventaData.metodoPago
    };

    console.log('Datos de venta:', ventaPayload); // Para debug

    const response = await api.post(
      `/productos/${productoSeleccionado.id}/venta`, 
      ventaPayload
    );
    
    // Actualizar el producto con los datos de la respuesta
    const updatedProductos = productos.map(p => 
      p.id === productoSeleccionado.id ? 
        {...p, stock: p.stock - ventaData.cantidad} : p
    );
    
    setProductos(updatedProductos);
    setVentaDialogOpen(false);
    setProductoSeleccionado(null);
    setVentaData({
      clienteId: '',
      cantidad: 1,
      metodoPago: 'EFECTIVO'
    });

    // Opcional: agregar mensaje de éxito
    setError(null);
  } catch (err) {
    console.error('Error en venta:', err);
    setError('Error al realizar la venta');
  }
};
    
    return (
      
        <>

<Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid #1976d2', pb: 2 }}>
  <LocalMall 
    sx={{ 
      fontSize: 35, 
      mr: 2, 
      color: 'primary.main',
      transform: 'rotate(-15deg)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'rotate(0deg) scale(1.1)'
      }
    }} 
  />
  <Typography 
    variant="h5" 
    sx={{
      fontWeight: 600,
      background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
    }}
  >
    Listado de Productos
  </Typography>
</Box>


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
        {productosAPaginar.map(producto => (
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
  <DialogTitle>Realizar Venta</DialogTitle>  
  <DialogContent>
    {productoSeleccionado && (
      <Box sx={{ mt: 2 }}>
        <Typography><strong>Producto:</strong> {productoSeleccionado.nombre}</Typography>
        <Typography><strong>Precio:</strong> ${productoSeleccionado.precio}</Typography>
        
        <TextField
          fullWidth
          margin="normal"
          label="Buscar cliente"
          value={clientSearchTerm}
          onChange={(e) => setClientSearchTerm(e.target.value)}
          placeholder="Buscar por nombre..."
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Cliente</InputLabel>
          <Select
            value={ventaData.clienteId}
            onChange={(e) => setVentaData({...ventaData, clienteId: e.target.value})}
          >
            {clientes
              .filter(cliente => 
                clientSearchTerm === '' || 
                `${cliente.nombre} ${cliente.apellido}`
                  .toLowerCase()
                  .includes(clientSearchTerm.toLowerCase())
              )
              .map(cliente => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {`${cliente.nombre} ${cliente.apellido}`}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Cantidad"
          type="number"
          value={ventaData.cantidad}
          onChange={(e) => setVentaData({...ventaData, cantidad: parseInt(e.target.value)})}
          InputProps={{ inputProps: { min: 1, max: productoSeleccionado.stock } }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Método de Pago</InputLabel>
          <Select
            value={ventaData.metodoPago}
            onChange={(e) => setVentaData({...ventaData, metodoPago: e.target.value})}
          >
            <MenuItem value="EFECTIVO">Efectivo</MenuItem>
            <MenuItem value="TARJETA">Tarjeta</MenuItem>
            <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
          </Select>
        </FormControl>
      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setVentaDialogOpen(false)}>Cancelar</Button>
    <Button onClick={confirmarVenta} variant="contained" color="primary">
      Confirmar Venta
    </Button>
  </DialogActions>
</Dialog>

            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
  <Button 
    disabled={paginaActual === 1 || productosFiltrados.length === 0} 
    onClick={() => setPaginaActual(prev => prev - 1)}
  >
    Anterior
  </Button>
  <Typography sx={{ alignSelf: 'center' }}>
    Página {productosFiltrados.length === 0 ? 0 : paginaActual} de {productosFiltrados.length === 0 ? 0 : totalPaginas}
  </Typography>
  <Button 
    disabled={paginaActual === totalPaginas || productosFiltrados.length === 0} 
    onClick={() => setPaginaActual(prev => prev + 1)}
  >
    Siguiente
  </Button>
</Box>

      </>
    );
  };
  export default Productos;