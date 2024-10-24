import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ticketService from "../services/ticket.service";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Divider from "@mui/material/Divider"; 
import CircularProgress from "@mui/material/CircularProgress";

const AllTicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyingTicketId, setVerifyingTicketId] = useState(null); // Para mostrar el estado de verificación de un ticket específico

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = () => {
    setLoading(true);
    ticketService.getTickets() // Asegúrate de que el nombre de la función sea correcto
      .then((response) => {
        if (response && response.data) {
          setTickets(response.data);
          setError(null);
        } else {
          setError("No se encontraron tickets.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error al obtener los tickets:", error);
        setError("Ocurrió un error al obtener los tickets.");
        setLoading(false);
      });
  };

  const verifyTicket = (ticketId) => {
    setVerifyingTicketId(ticketId);
    navigate(`/ticket/${ticketId}`);
  };
  if(localStorage.getItem("permisos")==2){
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={2}
    >
      <h3> Vista de Ejecutivo </h3>
      <hr />

      {loading && <div>Cargando tickets...</div>}

      {!loading && tickets.length > 0 && (
        <List style={{ width: '100%', maxWidth: 600 }}>
          {tickets.map((ticket) => (
            <Box key={ticket.id} mb={2}>
              <ListItem alignItems="flex-start" divider>
                <ListItemText
                  primary={`Ticket ID: ${ticket.id}`}
                  secondary={`Monto: ${ticket.amount} | Años: ${ticket.years} | Tipo: ${ticket.type} | Estado: ${ticket.status} | paso: ${ticket.step}`}
                />
                <ListItemSecondaryAction>
                 
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => verifyTicket(ticket.id)} // Ejecuta la verificación
                      style={{ marginLeft: 16 }}
                    >
                      Verificar
                    </Button>
                  
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      )}

      {error && (
        <div style={{ color: "red" }}>
          <h4>Error: {error}</h4>
        </div>
      )}

      {!loading && tickets.length === 0 && !error && (
        <div>No se encontraron tickets.</div>
      )}

      <Button variant="contained" color="primary" onClick={fetchAllTickets}>
        Recargar Tickets
      </Button>
    </Box>
  )}else{
    return(
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
      >
        <h3> No tienes permisos para ver esta página </h3>
      </Box>
    );
  }
};

export default AllTicketsList;
