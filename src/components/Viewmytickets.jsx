import { useState, useEffect } from "react";
import ticketService from "../services/ticket.service";
import loanService from "../services/loan.service";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const userId = localStorage.getItem("id_usuario");
  const [totalCost, setTotalCost] = useState(0);

  // Mapeo de estados
  const statusMapping = {
    E3: "En revisión",
    E4: "Pre-Aprobada | Se requiere aceptación de términos",
    E5: "Aprobación final",
    E6: "Aprobada",
    E7: "Rechazada",
    E8: "Cancelada por cliente",
    E9: "En desembolso",
  };

  const colorMapping = {
    "E3": "orange",    // En revisión
    "E4": "blue",      // Pre-Aprobada
    "E5": "purple",    // En Aprobación Final
    "E6": "green",     // Aprobada
    "E7": "red",       // Rechazada
    "E8": "grey",      // Cancelada por cliente
    "E9": "darkblue"   // En desembolso
  };


  const tipoMapping = {
    1: "Crédito de Primera Vivienda",
    2: "Crédito de Segunda Vivienda",
    3: "Crédito de Propiedades Comerciales",
    4: "Crédito de Remodelacion",
  }

  useEffect(() => {
    if (userId) {
      fetchTickets(userId);
    }
  }, [userId]);

  const fetchTickets = (userId) => {
    setLoading(true);
    ticketService
      .getByUser(userId)
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

  const cancelTicket = (ticketId) => {
    if (window.confirm("¿Estás seguro de cancelar el ticket?")) {
      ticketService.cancelTicket(ticketId)
        .then(() => {
          console.log(`Ticket ${ticketId} cancelado.`);
          fetchTickets(userId);
        })
        .catch((error) => {
          console.log("Error al cancelar el ticket:", error);
          setError("Ocurrió un error al cancelar el ticket.");
        });
    }
  };

  const rejectConditions = () => {
    if (window.confirm("¿Estás seguro de rechazar los términos del ticket?")) {
      ticketService.cancelTicket(selectedTicket)
        .then(() => {
          console.log(`Términos del ticket ${selectedTicket} rechazados.`);
          fetchTickets(userId);
        })
        .catch((error) => {
          console.log("Error al rechazar los términos del ticket:", error);
          setError("Ocurrió un error al rechazar los términos del ticket.");
        });
      setOpen(false);
    }
  };

  const handleClickOpen = (ticket) => {
    loanService.calculateTotalAmount(ticket.amount, ticket.interest, ticket.years)
      .then((response) => {
        console.log("Costo total del ticket:", response);
        setTotalCost(response.data);
      });
    setSelectedTicket(ticket);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAccept = async () => {
    console.log("Términos aceptados para el ticket:", selectedTicket);
    try {
      const response = await ticketService.acceptUser(selectedTicket);
      await ticketService.saveTicket(response.data); // Espera a que saveTicket termine
      await fetchTickets(userId); // Llama a fetchTickets una vez saveTicket haya terminado
    } catch (error) {
      console.log("Error al aceptar los términos del ticket:", error);
      setError("Ocurrió un error al aceptar los términos del ticket.");
    }
    setOpen(false);
  };



  if (localStorage.getItem("id_usuario") != null) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
      >
        <h3> Lista de Tickets </h3>
        <hr />

        {loading && <div>Cargando tickets...</div>}

        {!loading && tickets.length > 0 && (
          <List style={{ width: '100%', maxWidth: 900 }}>
            {tickets.map((ticket) => (
              <Box key={ticket.id} mb={2}>
                <ListItem alignItems="flex-start" divider>
                  <div style={{ flexGrow: 1 }}>
                    <ListItemText
                      primary={`Estado: ${statusMapping[ticket.status] || ticket.status} | ID: ${ticket.id}`}
                      secondary={
                        <>
                          <strong>Monto:</strong> {ticket.amount.toLocaleString('es-ES')} CLP |{" "}
                          <strong>Años:</strong> {ticket.years} |{" "}
                          <strong>Tipo:</strong> {tipoMapping[ticket.type]} |{" "}
                          <strong>Estado:</strong> {statusMapping[ticket.status] || ticket.status}
                        </>
                      }
                      sx={{
                        "& .MuiListItemText-primary": {
                          color: colorMapping[ticket.status] || "black", // Default color if status is undefined
                          fontSize: "1.2rem", // Adjust the font size as needed
                          fontWeight: "bold" // Optional: make the text bold
                        }
                      }}
                    />


                  </div>
                  <ListItemSecondaryAction>
                    {ticket.status === "E4" || ticket.status === "E6" || ticket.status === "E5" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleClickOpen(ticket)}
                        style={{ marginLeft: 16 }}
                      >
                        Ver términos
                      </Button>
                    ) : (
                      ticket.status != "E8" && ticket.status != "E7" && ticket.status != "E6" && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => cancelTicket(ticket)}
                          style={{ marginLeft: 16 }}
                        >
                          Cancelar Solicitud
                        </Button>
                      )
                    )}
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

        <Button variant="contained" color="primary" onClick={() => fetchTickets(userId)}>
          Recargar Tickets
        </Button>

        {/* Popup con los términos del ticket */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Términos del Ticket</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <strong>Ticket ID:</strong> {selectedTicket?.id} <br />
              <strong>Monto Solicitado:</strong> {selectedTicket?.amount.toLocaleString('es-ES')} <br />
              <strong>Años del credito:</strong>{selectedTicket?.years} <br />
              <strong>Cuota Mensual:</strong> {Math.round(selectedTicket?.fee).toLocaleString('es-ES')} CLP <br />
              <strong>Tasa de Interes:</strong> {selectedTicket?.interest} % <br />
              <strong>Comision por Administracion:</strong> {Math.round(selectedTicket?.amount * 0.01).toLocaleString('es-ES')} CLP (1% del total del monto solicitado)<br />
              <strong>Seguro de desgravamen:</strong> {Math.round(selectedTicket?.amount * 0.0003).toLocaleString('es-ES')} CLP  (0.03% del monto total por mes)<br />
              <strong>Seguro de incendios: </strong>20.000 CLP por mes<br />
              <strong>Costo Mensual: </strong>{Math.round(selectedTicket?.fee + selectedTicket?.amount * 0.0003 + 20000).toLocaleString('es-ES')} CLP <br />
              <strong>Costo total: </strong>{totalCost.toLocaleString('es-ES')} CLP <br />
              {/* Agrega más detalles si lo deseas */}
            </DialogContentText>

          </DialogContent>
          <DialogActions>
            {selectedTicket?.status === "E4" && (<>
              <Button variant="contained" onClick={handleAccept} color="success">
                Aceptar
              </Button>
              <Button variant="contained" onClick={rejectConditions} color="error">
                Rechazar
              </Button>
            </>
            )}
            {selectedTicket?.status === "E5" && (
              <Button variant="contained" onClick={rejectConditions} color="error">
                Cancelar ticket
              </Button>
            )}
            <Button variant="contained" onClick={handleClose} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  } else {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
      >
        <h3> Lista de Tickets </h3>
        <hr />
        <div>Debe iniciar sesión para ver sus tickets.</div>
      </Box>
    );
  }
};

export default TicketList;
