import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ticketService from "../services/ticket.service";
import documentService from "../services/document.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

const LoanRequestForm = () => {
    const [amount, setAmount] = useState(""); // Inicializa como string
    const [years, setYears] = useState("");
    const [interest, setInterest] = useState("");
    const [type, setType] = useState(1);
    const [files, setFiles] = useState([null, null, null, null]); // Arreglo para los archivos
    const [error, setError] = useState(""); // Estado para manejar errores

    const navigate = useNavigate();

    const interestRanges = {
        1: { min: 3.5, max: 5 },
        2: { min: 4, max: 6 },
        3: { min: 5, max: 7 },
        4: { min: 4.5, max: 6 },
    };

    // Función para formatear el número con separadores de miles
    const formatNumber = (num) => {
        return num.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    };

    const handleFileChange = (e, type, index) => {
        const newFiles = [...files];
        newFiles[index] = [e.target.files[0], type]; // Guarda el archivo en el índice correspondiente
        setFiles(newFiles);
    };

    const handleSaveTicket = async (e) => {
        e.preventDefault();
        if(!window.confirm("¿Estás seguro de enviar la solicitud?")){
            return}
        // Validación de los campos
        if (!amount || !years || !interest) {
            setError("Todos los campos deben estar completos.");
            return;
        }

        switch (type) {
            case 1:
                if (years < 0 || years > 30) {
                    setError("El plazo debe estar entre 1 y 30 años para los prestamos de primera vivienda.");
                    return;
                }
                break;
            
            case 2:
                if (years < 0 || years > 20) {
                    setError("El plazo debe estar entre 1 y 20 años para los prestamos de segunda vivienda.");
                    return;
                }
                break;

            case 3:
                if (years < 0 || years > 25) {
                    setError("El plazo debe estar entre 1 y 25 años para los prestamos de propiedades comerciales.");
                    return;
                }
                break;

            case 4:
                if (years < 0 || years > 15) {
                    setError("El plazo debe estar entre 1 y 15 años para los prestamos de remodelación.");
                    return;
                }
                break;
        }

         // Validación de rango de interés según el tipo de préstamo
         const { min, max } = interestRanges[type];
         const interestValue = parseFloat(interest);
         if (interestValue < min || interestValue > max) {
             setError(`El interés debe estar entre ${min}% y ${max}% para este tipo de préstamo.`);
             return;
         }

        // Validación de los documentos según el tipo
        let requiredFiles = [];
        if (type === 1) {
            requiredFiles = [files[0], files[1], files[2]]; // 3 archivos para el tipo 1
        } else if (type === 2) {
            requiredFiles = [files[0], files[1], files[2], files[3]]; // 4 archivos para el tipo 2
        } else if (type === 3) {
            requiredFiles = [files[0], files[1], files[2], files[3]]; // 4 archivos para el tipo 3
        } else if (type === 4) {
            requiredFiles = [files[0], files[1], files[2]]; // 3 archivos para el tipo 4
        }

        const missingFiles = requiredFiles.filter(file => !file);
        if (missingFiles.length > 0) {
            setError("Todos los documentos requeridos deben ser subidos.");
            return;
        }

        setError(""); // Limpiar cualquier error previo

        // Convertir el monto a número sin comas
        const formattedAmount = Number(amount.replace(/\./g, "").replace(/\D/g, ""));
        if (isNaN(formattedAmount)) {
            setError("El monto debe ser un número válido.");
            return;
        }

        const ticketData = {
            usuario: localStorage.getItem("id_usuario"),
            amount: formattedAmount, // Usa el monto formateado
            years,
            interest,
            type,
            user_birth: localStorage.getItem("user_birth")
        };

        try {
            const response = await ticketService.registerTicket(ticketData);
            if (response.data) {
                for (let i = 0; i < files.length; i++) {
                    if (files[i]) {
                        await sendDocument(
                            localStorage.getItem("id_usuario"),
                            response.data.id,
                            files[i][1], // type del archivo
                            files[i][0]  // archivo en sí
                        );
                    }
                }
                alert("Solicitud enviada exitosamente.");
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error al guardar el ticket:", error);
        }
    };

    const sendDocument = async (user, id_ticket, type, file) => {
        const formData = new FormData();
        formData.append("File", file);
        formData.append("Type", Number(type));
        formData.append("Ticket", Number(id_ticket));
        formData.append("User", Number(user));

        try {
            const response = await documentService.saveDocument(formData);
            console.log("Documento enviado exitosamente:", file.name);
        } catch (error) {
            console.error("Error al enviar el documento:", error.response?.data || error);
        }
    };

    if (localStorage.getItem("id_usuario") != null) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                component="form"
                onSubmit={handleSaveTicket}
            >
                <h3>Solicitud de Préstamo</h3>
                <hr />
                <FormControl fullWidth>
                    <TextField
                        id="amount"
                        label="Monto a solicitar"
                        type="text" // Cambiar a 'text' para permitir la formateación
                        value={amount}
                        variant="standard"
                        onChange={(e) => setAmount(formatNumber(e.target.value))}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        id="years"
                        label="Años"
                        type="number"
                        value={years}
                        variant="standard"
                        onChange={(e) => setYears(Number(e.target.value))}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        id="interest"
                        label="Interés porcentual (Ej: 4.5)"
                        type="text"
                        value={interest}
                        variant="standard"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value) || value === "") {
                                setInterest(value);
                            }
                        }}
                    />
                </FormControl>
                <p>Tipo de préstamo</p>
                <FormControl fullWidth>
                    <InputLabel id="type-label"></InputLabel>
                    <Select
                        labelId="type-label"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <MenuItem value={1}>Préstamo de primera Vivienda</MenuItem>
                        <MenuItem value={2}>Préstamo de Segunda Vivienda</MenuItem>
                        <MenuItem value={3}>Préstamo de Propiedades Comerciales</MenuItem>
                        <MenuItem value={4}>Préstamo de Remodelación</MenuItem>
                    </Select>
                </FormControl>

                {/* Mostrar error si lo hay */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Cargar archivos según el tipo */}
                <h4>Cargar Documentos:</h4>
                {type === 1 && (
                    <>
                        <Button variant="outlined" component="label">
                            Comprobante de Ingresos
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 1, 0)}
                            />
                        </Button>
                        {files[0] && <span>{files[0][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Certificado de Avalúo
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 2, 1)}
                            />
                        </Button>
                        {files[1] && <span>{files[1][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Historial Crediticio
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 3, 2)}
                            />
                        </Button>
                        {files[2] && <span>{files[2][0].name}</span>}
                    </>
                )}
                {type === 2 && (
                    <>
                        <Button variant="outlined" component="label">
                            Comprobante de Ingresos
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 1, 0)}
                            />
                        </Button>
                        {files[0] && <span>{files[0][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Certificado de Avalúo
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 2, 1)}
                            />
                        </Button>
                        {files[1] && <span>{files[1][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Escritura de Vivienda
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 4, 2)}
                            />
                        </Button>
                        {files[2] && <span>{files[2][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Historial Crediticio
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 3, 3)}
                            />
                        </Button>
                        {files[3] && <span>{files[3][0].name}</span>}
                    </>
                )}
                {type === 3 && (
                    <>
                        <Button variant="outlined" component="label">
                            Estado Financiero
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 1, 0)}
                            />
                        </Button>
                        {files[0] && <span>{files[0][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Comprobante de Ingresos
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 2, 1)}
                            />
                        </Button>
                        {files[1] && <span>{files[1][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Certificado de Avalúo
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 3, 2)}
                            />
                        </Button>
                        {files[2] && <span>{files[2][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Plan de Negocios
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 4, 3)}
                            />
                        </Button>
                        {files[3] && <span>{files[3][0].name}</span>}
                    </>
                )}
                {type === 4 && (
                    <>
                        <Button variant="outlined" component="label">
                            Comprobante de Ingresos
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 1, 0)}
                            />
                        </Button>
                        {files[0] && <span>{files[0][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Presupuesto de Remodelación
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 2, 1)}
                            />
                        </Button>
                        {files[1] && <span>{files[1][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Certificado de Avalúo Actualizado
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 3, 2)}
                            />
                        </Button>
                        {files[2] && <span>{files[2][0].name}</span>}
                    </>
                )}
                <p></p>
                <Button type="submit" variant="contained">
                    Guardar Ticket
                </Button>
            </Box>
        );
    } else {
        return (
            <div>
                <h1>Usuario no autenticado</h1>
            </div>
        );
    }
};

export default LoanRequestForm;
