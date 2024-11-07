import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ticketService from "../services/ticket.service";
import loanService from "../services/loan.service";
import userService from "../services/user.service";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import documentService from "../services/document.service";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";


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

const pasoMapping = {
    1: "Verificar Relación Cuota Ingresos",
    2: "Verificar Historial Crediticio del Solicitante",
    3: "Antigüedad Laboral y Estabilidad",
    4: "Relación Deuda/Ingreso",
    5: "Monto Máximo del Financiamiento",
    6: "Edad del Solicitante",
    7: "Capacidad de Ahorro",
    8: "Aprobación Final",
}

const TicketDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalAmount, setAmount] = useState(0);
    const [user, setUser] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [r1, setR1] = useState(false);
    const [r2, setR2] = useState(false);
    const [r3, setR3] = useState(false);
    const [r4, setR4] = useState(false);
    const [r5, setR5] = useState(false);
    const [Req1, setReq1] = useState("");
    const [Req3, setReq3] = useState("");
    const [Req41, setReq41] = useState("");
    const [Req42, setReq42] = useState("");
    const [Req5, setReq5] = useState("");
    const [resultado1, setResultado1] = useState(null);
    const [resultado3, setResultado3] = useState(null);
    const [resultado4, setResultado4] = useState(null);
    const [resultado5, setResultado5] = useState(null);
    const [resultado6, setResultado6] = useState(null);
    const [resultado7, setResultado7] = useState(null);

    const handlestep1 = () => {
        const cleanReq1 = parseFloat(Req1.replace(/\./g, ""));
        ticketService.validater1(cleanReq1, ticket.fee).then(response => { setResultado1(response.data); })
    };



    const handlestep3 = () => {
        ticketService.validater3(Req3, isChecked).then(response => { setResultado3(response.data); })
    };

    const handlestep4 = () => {
        const cleanReq41 = parseFloat(Req41.replace(/\./g, ""));
        const cleanReq42 = parseFloat(Req42.replace(/\./g, ""));
        ticketService.validater4(ticket.fee, cleanReq42, cleanReq41).then(response => { setResultado4(response.data); })
    };

    const handlestep5 = () => {
        const cleanReq5 = parseFloat(Req5.replace(/\./g, ""));
        ticketService.validater5(ticket.amount, ticket.type, cleanReq5).then(response => { setResultado5(response.data); })
    };

    const handlestep6 = () => {
        ticketService.validater6(user.birthDate, ticket.years).then(response => { setResultado6(response.data); })
    };

    const handlestep7 = () => {
        ticketService.validater7(r1, r2, r3, r4, r5).then(response => { setResultado7(response.data); })
    };

    const handlestep8 = () => {
        if (window.confirm("¿Está seguro de que quiere aceptar?")) {
            ticketService.aproveTicket(ticket)
            navigate("/executive")
        }

    };

    const handlereject = () => {
        if (window.confirm("¿Está seguro de que quiere rechazar el prestamo?")) {
            ticketService.rejectTicket(ticket);
            navigate("/executive")
        }
    };

    const handleReturn = () => {
        navigate("/executive")
    };

    const formatNumber = (value) => {
        // Convierte el valor a número y lo formatea
        return value.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    };

    const handleincomechange = (e) => {
        const inputValue = e.target.value;
        const formattedValue = formatNumber(inputValue);
        setReq1(formattedValue);
    };

    const handleincomechange41 = (e) => {
        const inputValue = e.target.value;
        const formattedValue = formatNumber(inputValue);
        setReq41(formattedValue);
    };

    const handledebtchange42 = (e) => {
        const inputValue = e.target.value;
        const formattedValue = formatNumber(inputValue);
        setReq42(formattedValue);
    };

    const handlepricetagchange = (e) => {
        const inputValue = e.target.value;
        const formattedValue = formatNumber(inputValue);
        setReq5(formattedValue);
    };

    const setStep = () => {
        if (window.confirm("¿Está seguro de que quiere aceptar?")) {
            ticketService.setStep(ticket).then(response => { setTicket(response.data); })
        }
    };

    const acceptTicketExecutive = () => {
        if (window.confirm("¿Está seguro de que quiere aceptar?")) {
            ticketService.acceptTicketExecutive(ticket).then(response => {
                setTicket(response.data);
                navigate("/executive")
            })
        }
    };

    const handleChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handler1 = (event) => {
        setR1(event.target.checked);
    };

    const handler2 = (event) => {
        setR2(event.target.checked);
    };

    const handler3 = (event) => {
        setR3(event.target.checked);
    };

    const handler4 = (event) => {
        setR4(event.target.checked);
    };

    const handler5 = (event) => {
        setR5(event.target.checked);
    };

    useEffect(() => {
        ticketService.getTicketById(id) // Asegúrate de que esta función existe en tu servicio
            .then(response => {
                setTicket(response.data);
                console.log(response);
                loanService.calculateTotalAmount(response.data.amount, response.data.interest, response.data.years)
                    .then(response => { setAmount(response.data); })
                userService.getUser(response.data.usuario).then(response => {
                    console.log(response.data);
                    setUser(response.data);
                })
                setLoading(false);
                setError(null);
            })
            .catch(err => {
                setError("Error al obtener los detalles del ticket.");
                setLoading(false);
            });
    }, [id]);

    const handleDownloadDocuments = () => {
        documentService.getDocumentByTicket(id)
            .then((response) => {
                // Crear un blob a partir de la respuesta del backend
                const blob = new Blob([response.data], { type: 'application/zip' });

                // Crear un enlace de descarga temporal
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `documents_${id}.zip`; // Nombre del archivo ZIP a descargar
                link.click();

                // Limpiar el URL del blob para liberar memoria
                window.URL.revokeObjectURL(link.href);
            })
            .catch((error) => {
                console.log("Error al descargar los documentos:", error);
            });
    };


    const renderStepContent = (step) => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <Typography variant="h6">Paso 1: Verificar Relación Cuota Ingresos</Typography>
                        <TextField
                            label="Rellene con los ingresos del solicitante"
                            type="text"
                            variant="outlined"
                            value={Req1}
                            fullWidth
                            margin="normal"
                            onChange={handleincomechange}

                        />
                        <Button type="submit" variant="contained" onClick={handlestep1}>
                            Calcular
                        </Button>
                        {resultado1 === true && (<p>Resultado de evaluacion Aceptar.</p>)}
                        {resultado1 === false && (<p>Resultado de evaluacion Rechazar.</p>)}
                        <p></p>
                        <Box display="flex" gap={2} mt={2} justifyContent="center" alignItems="center">  {/* Espacio entre botones */}
                            <Button type="submit" variant="contained" color="success" onClick={setStep}>
                                Aceptar cuota/ingresos
                            </Button>
                            <Button type="submit" variant="contained" color="error" onClick={handlereject}>
                                Rechazar solicitud
                            </Button>
                        </Box>
                        <p></p>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <Typography variant="h6">Paso 2: Verificar Historial Crediticio del Solicitante</Typography>
                        <p>Rut del Cliente DICOM: {user ? user.rut : 'Cargando...'} </p>
                        <Box display="flex" gap={2} mt={2} justifyContent="center" alignItems="center">  {/* Espacio entre botones */}
                            <Button type="submit" variant="contained" color="success" onClick={setStep}>
                                Aceptar Historial Crediticio
                            </Button>
                            <Button type="submit" variant="contained" color="error" onClick={handlereject}>
                                Rechazar solicitud
                            </Button>
                        </Box>
                        <p></p>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <Typography variant="h6">Paso 3: Antigüedad Laboral y Estabilidad</Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isChecked}
                                    onChange={handleChange}
                                    color="primary"
                                />
                            }
                            label={<Typography variant="body1">Independiente</Typography>}
                        />
                        <TextField
                            label="Ingrese años en el trabajo"
                            type="number"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setReq3(Number(e.target.value))}
                        />
                        <Button type="submit" variant="contained" onClick={handlestep3}>
                            Calcular
                        </Button>
                        {resultado3 === true && (<p>Resultado de evaluacion Aceptar.</p>)}
                        {resultado3 === false && (<p>Resultado de evaluacion Rechazar.</p>)}
                        <Box display="flex" gap={2} mt={2} justifyContent="center" alignItems="center">  {/* Espacio entre botones */}
                            <Button type="submit" variant="contained" color="success" onClick={setStep}>
                                Aceptar Antiguedad Laboral
                            </Button>
                            <Button type="submit" variant="contained" color="error" onClick={handlereject}>
                                Rechazar solicitud
                            </Button>
                        </Box>
                        <p></p>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <Typography variant="h6">Paso 4: Relación Deuda/Ingreso</Typography>
                        <TextField
                            label="Ingresos del cliente"
                            type="text"
                            variant="outlined"
                            value={Req41}
                            fullWidth
                            margin="normal"
                            onChange={handleincomechange41}
                        />
                        <TextField
                            label="Ingrese cuota de otras deudas"
                            type="text"
                            variant="outlined"
                            value={Req42}
                            fullWidth
                            margin="normal"
                            onChange={handledebtchange42}
                        />
                        <Button type="submit" variant="contained" onClick={handlestep4}>
                            Calcular
                        </Button>
                        {resultado4 === true && (<p>Resultado de evaluacion Aceptar.</p>)}
                        {resultado4 === false && (<p>Resultado de evaluacion Rechazar.</p>)}
                        <Box display="flex" gap={2} mt={2} justifyContent="center" alignItems="center">  {/* Espacio entre botones */}
                            <Button type="submit" variant="contained" color="success" onClick={setStep}>
                                Aceptar Deuda/Ingreso
                            </Button>
                            <Button type="submit" variant="contained" color="error" onClick={handlereject}>
                                Rechazar solicitud
                            </Button>
                        </Box>
                        <p></p>
                    </div>
                );
            case 5:
                return (
                    <div>
                        <Typography variant="h6">Paso 5: Monto Máximo del Financiamiento</Typography>
                        <TextField
                            label="Ingrese la valuacion de propiedad/remodelacion"
                            type="text"
                            variant="outlined"
                            value={Req5}
                            fullWidth
                            margin="normal"
                            onChange={handlepricetagchange}
                        />
                        <Button type="submit" variant="contained" onClick={handlestep5}>
                            Calcular
                        </Button>
                        {resultado5 === true && (<p>Resultado de evaluacion Aceptar.</p>)}
                        {resultado5 === false && (<p>Resultado de evaluacion Rechazar.</p>)}
                        <Box display="flex" gap={2} mt={2} justifyContent="center" alignItems="center">  {/* Espacio entre botones */}
                            <Button type="submit" variant="contained" color="success" onClick={setStep}>
                                Aceptar Monto Máximo
                            </Button>
                            <Button type="submit" variant="contained" color="error" onClick={handlereject}>
                                Rechazar solicitud
                            </Button>
                        </Box>
                        <p></p>
                    </div>
                );
            case 6:
                return (
                    <div>
                        <h3>Edad del Solicitante</h3>
                        <Button type="submit" variant="contained" onClick={handlestep6}>
                            Calcular
                        </Button>
                        {resultado6 === true && (<p>Resultado de evaluacion Aceptar.</p>)}
                        {resultado6 === false && (<p>Resultado de evaluacion Rechazar.</p>)}
                        <Box display="flex" gap={2} mt={2} justifyContent="center" alignItems="center">  {/* Espacio entre botones */}
                            <Button type="submit" variant="contained" color="success" onClick={setStep}>
                                Aceptar Edad del solicitante
                            </Button>
                            <Button type="submit" variant="contained" color="error" onClick={handlereject}>
                                Rechazar solicitud
                            </Button>
                        </Box>
                        <p></p>
                    </div>
                );
            case 7:
                return (
                    <div>
                        <Typography variant="h6">Paso 7: Capacidad de Ahorro</Typography>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Checkbox
                                    checked={r1}
                                    onChange={handler1}
                                    name="saldoMinimo"
                                    color="primary"
                                />
                                <Typography variant="body1">Saldo mínimo requerido</Typography>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Checkbox
                                    checked={r2}
                                    onChange={handler2}
                                    name="historialAhorro"
                                    color="primary"
                                />
                                <Typography variant="body1">Historial de Ahorro</Typography>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Checkbox
                                    checked={r3}
                                    onChange={handler3}
                                    name="depositosPeriodicos"
                                    color="primary"
                                />
                                <Typography variant="body1">Depósitos Periódicos</Typography>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Checkbox
                                    checked={r4}
                                    onChange={handler4}
                                    name="saldoAntiguedad"
                                    color="primary"
                                />
                                <Typography variant="body1">Saldo/años Antigüedad</Typography>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Checkbox
                                    checked={r5}
                                    onChange={handler5}
                                    name="retirosRecientes"
                                    color="primary"
                                />
                                <Typography variant="body1" style={{ marginTop: 4 }}>
                                    Retiros Recientes
                                </Typography>
                            </div>
                        </div>
                        <Button type="submit" variant="contained" onClick={handlestep7}>
                            Calcular
                        </Button>
                        {resultado7 === 0 && (<p>Resultado de evaluacion Rechazar.</p>)}
                        {resultado7 === 1 && (<p>Resultado de evaluacion Aceptar.</p>)}
                        {resultado7 === 2 && (<p>Resultado de evaluacion Revision adicional.</p>)}
                        <Box display="flex" gap={2} mt={2} justifyContent="center" alignItems="center">  {/* Espacio entre botones */}
                            <Button type="submit" variant="contained" color="success" onClick={acceptTicketExecutive}>
                                Aceptar Capacidad de Ahorro
                            </Button>
                            <Button type="submit" variant="contained" color="error" onClick={handlereject}>
                                Rechazar solicitud
                            </Button>
                        </Box>
                        <p></p>
                    </div>
                );
            case 8:
                return (
                    <div>
                        <Typography variant="h6">Paso 8: Aprobación Final</Typography>
                        <p>Si selecciona Aprobar solicitud se actualizara el estado de la solicitud a Aprobada y Desembolsada.</p>
                        <Box display="flex" gap={2} mt={2} justifyContent="center" alignItems="center">  {/* Espacio entre botones */}
                            <Button type="submit" variant="contained" color="success" onClick={handlestep8}>
                                Aceptar solicitud
                            </Button>
                            <Button type="submit" variant="contained" color="error" onClick={handlereject}>
                                Rechazar solicitud
                            </Button>
                        </Box>
                        <p></p>
                    </div>
                );

            // Agrega más pasos según sea necesario
            default:
                return <div>Contenido final</div>;
        }
    };
    if (localStorage.getItem("permisos") == 2) {
        return (
            <Box p={2}>
                {loading && <div>Cargando detalles del ticket...</div>}
                {error && <div style={{ color: "red" }}>{error}</div>}
                {ticket ? (
                    
                    <Grid container spacing={2}>
                        <Button variant="contained" color="primary" onClick={handleReturn} sx={{marginBlock: '20px'}}> Regresar a solicitudes</Button>
                        <Grid item xs={12}>
                            <h3>Detalles del Ticket ID: {ticket.id}</h3>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <p> <strong>Monto:</strong> {ticket.amount.toLocaleString('es-ES')} </p>
                                <p> <strong>Tipo:</strong> {tipoMapping[ticket.type]}</p>
                                <p> <strong>Paso:</strong> {pasoMapping[ticket.step]}</p>
                                <p> <strong>Costo total del credito:</strong> {totalAmount.toLocaleString('es-ES')} CLP</p>
                            </Grid>
                            <Grid item xs={6}>
                                <p> <strong>Años:</strong>Años: {ticket.years}</p>
                                <p> <strong>Estado:</strong> {statusMapping[ticket.status] || ticket.status}</p>
                                <p> <strong>Cuota Mensual:</strong> {Math.round(ticket.fee).toLocaleString('es-ES')} CLP</p>

                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            {renderStepContent(ticket.step)} {/* Muestra contenido según el paso */}
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleDownloadDocuments}>
                                Descargar Documentos
                            </Button>
                        </Grid>
                    </Grid>
                ) : (
                    <div>
                        <h3>No tienes permisos para ver esta página</h3>
                    </div>
                )}
                <div style={{ textAlign: 'justify' }}>
                    <h3><strong>Instrucciones de uso:</strong></h3>
                    <p>En este formulario, tendrá que introducir los datos de los solicitantes. Los pasos son los siguientes:</p>
                    <p>1.- Si en el paso que está la solicitud, requiere de documentos, presione el botón de descarga para obtener todos los documentos asociados a la solicitud. Si no, omita este paso.</p>
                    <p>2.- Si detecta que algun documento es erroneo o falso, rechace la solicitud.</p>
                    <p>3.- Rellene todos los datos necesarios para el paso, luego presione en Calcular.</p>
                    <p>4.- El resultado de Calcular le dirá si la solicitud sigue su evaluación o si tiene que ser rechazada.</p>
                    <p>5.- Finalmente tendrá que presionar el botón de aceptar o el botón rechazar.</p>
                    <p style={{ color: "red" }}><strong>ADVERTENCIA: Los pasos tienen doble verificación. Para aceptar los pasos debe estar seguro de esto, ya que no se puede modificar después.</strong></p>
                </div>
            </Box>
        )
    } else {
        return (
            <div>
                <h3> No tienes permisos para ver esta página </h3>
            </div>
        )
    };
};

export default TicketDetails;
