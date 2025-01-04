const MisClases = () => {
    const [clasesDisponibles, setClasesDisponibles] = useState([]);
    const [misClases, setMisClases] = useState([]);
    const userId = localStorage.getItem('userId');
  
    useEffect(() => {
      fetchClasesDisponibles();
      fetchMisClases();
    }, []);
  
    const inscribirme = async (claseId) => {
      try {
        await api.post(`/clases/${claseId}/inscribir/${userId}`);
        await fetchClasesDisponibles();
        await fetchMisClases();
      } catch (err) {
        setError('Error al inscribirte en la clase');
      }
    };
  
    const darmedeBaja = async (inscripcionId) => {
      try {
        await api.post(`/clases/inscripciones/${inscripcionId}/cancelar`);
        await fetchMisClases();
      } catch (err) {
        setError('Error al darte de baja de la clase');
      }
    };
  
    return (
      <>
        <Typography variant="h5">Clases Disponibles</Typography>
        <TableContainer>
          {/* Mostrar clases disponibles con botón de inscripción */}
        </TableContainer>
  
        <Typography variant="h5">Mis Clases</Typography>
        <TableContainer>
          {/* Mostrar clases inscritas con botón de baja */}
        </TableContainer>
      </>
    );
  };