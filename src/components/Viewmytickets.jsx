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
    E4: "Pre-Aprobada",
    E5: "Aprobación final",
    E6: "Aprobada",
    E7: "Rechazada",
    E8: "Cancelada por cliente",
    E9: "En desembolso",
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
    ticketService.cancelTicket(ticketId)
      .then(() => {
        console.log(`Ticket ${ticketId} cancelado.`);
        fetchTickets(userId);
      })
      .catch((error) => {
        console.log("Error al cancelar el ticket:", error);
        setError("Ocurrió un error al cancelar el ticket.");
      });
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

  const handleAccept = () => {
    console.log("Términos aceptados para el ticket:", selectedTicket);
    ticketService.acceptUser(selectedTicket)
      .then((response) => {
        ticketService.saveTicket(response.data);
        fetchTickets(userId);
      });
    setOpen(false);
  };

  const handleReject = () => {
    console.log("Términos rechazados para el ticket:", selectedTicket);
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
              Ticket ID: {selectedTicket?.id} <br />
              Monto Solicitado: {selectedTicket?.amount.toLocaleString('es-ES')} <br />
              Años del credito: {selectedTicket?.years} <br />
              Cuota Mensual: {Math.round(selectedTicket?.fee).toLocaleString('es-ES')} CLP <br />
              Tasa de Interes: {selectedTicket?.interest} % <br />
              Comision por Administracion: {Math.round(selectedTicket?.amount*0.01)} (1% del total del monto solicitado)<br />
              Seguro de desgravamen: {Math.round(selectedTicket?.amount*0.0003)}  (0.03% del monto total por mes)<br />
              Seguro de incendios: 20.000 CLP por mes<br />
              Costo Mensual: {Math.round(selectedTicket?.fee + selectedTicket?.amount*0.0003 + 20000).toLocaleString('es-ES')} CLP <br />
              Costo total: {totalCost.toLocaleString('es-ES')} CLP <br />
              {/* Agrega más detalles si lo deseas */}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {selectedTicket?.status === "E4" && (<>
              <Button onClick={handleAccept} color="primary">
                Aceptar
              </Button>
              <Button onClick={handleReject} color="secondary">
                Rechazar
              </Button>
            </>
            )}
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
