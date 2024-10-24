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
    const [idUser, setIdUser] = useState(0);
    const [amount, setAmount] = useState("");
    const [years, setYears] = useState("");
    const [interest, setInterest] = useState("");
    const [type, setType] = useState(1);
    const [userBirth, setUserBirth] = useState("");
    const [income, setIncome] = useState("");
    const [files, setFiles] = useState([null, null, null, null]); // Arreglo para los archivos
    const [error, setError] = useState(""); // Estado para manejar errores

    const navigate = useNavigate();

    const handleFileChange = (e, type, index) => {
        const newFiles = [...files];
        newFiles[index] = [e.target.files[0], type]; // Guarda el archivo en el índice correspondiente
        setFiles(newFiles);
    };

    const handleSaveTicket = async (e) => {
        e.preventDefault();

        // Validación de los campos
        if (!amount || !years || !interest) {
            setError("Todos los campos deben estar completos.");
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

        const ticketData = {
            usuario: localStorage.getItem("id_usuario"),
            amount,
            years,
            interest,
            type,
            user_birth: localStorage.getItem("user_birth"),
            income,
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
                        label="Monto"
                        type="number"
                        value={amount}
                        variant="standard"
                        onChange={(e) => setAmount(Number(e.target.value))}
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
                        label="Interés"
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
                                onChange={(e) => handleFileChange(e, 5, 0)}
                            />
                        </Button>
                        {files[0] && <span>{files[0][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Comprobante de Ingresos
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 1, 1)}
                            />
                        </Button>
                        {files[1] && <span>{files[1][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Certificado de Avalúo
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 2, 2)}
                            />
                        </Button>
                        {files[2] && <span>{files[2][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Plan de Negocios
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 6, 3)}
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
                                onChange={(e) => handleFileChange(e, 7, 1)}
                            />
                        </Button>
                        {files[1] && <span>{files[1][0].name}</span>}
                        <br />
                        <Button variant="outlined" component="label">
                            Certificado de Avalúo Actualizado
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 8, 2)}
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
        )
    } else {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <h3> Debes iniciar sesión para acceder a esta página </h3>
            </Box>
        );
    }
};

export default LoanRequestForm;
