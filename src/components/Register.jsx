import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/user.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";


const Register = () => {
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [income, setIncome] = useState("");
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [rut, setRut] = useState("");
    const [error, setError] = useState(null); // Estado para el mensaje de error
    const [open, setOpen] = useState(false); // Estado para el diálogo
  
    const navigate = useNavigate();
  

  const handleRegister = (e) => {
    e.preventDefault();
  
    const userData = {
      name,
      lastname,
      email,
      income,
      password,
      birthDate,
      rut,
      role: 1, // Siempre establecer el rol en 1
    };
  
    console.log("Registrando usuario con:", userData);
  
    authService
      .register(userData)
      .then((response) => {
        if (!response || response.data === null) {
          console.log("El registro falló. El servicio retornó null.");
          setError("El registro falló. Por favor, intente de nuevo.");
          setOpen(true); // Abrir el diálogo
          return; // Detener la ejecución y no navegar
        }
        console.log("Registro exitoso.", response.data);
        setError(null);
        localStorage.setItem("id_usuario",response.data.id);
        localStorage.setItem("income", response.data.income);
        localStorage.setItem("user_birth", response.data.birthDate);
        localStorage.setItem("permisos",response.data.role); 
        navigate("/dashboard"); // Redirigir al usuario si el registro fue exitoso
      })
      .catch((error) => {
        setError("Ocurrió un error al intentar registrarse.");
        setOpen(true); // Abrir el diálogo
        console.log("Error en el registro.", error);
      });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      component="form"
      onSubmit={handleRegister}
    >
      <h3> Registro de Usuario </h3>
      <hr />
  
      <FormControl fullWidth>
        <TextField
          id="name"
          label="Nombre"
          value={name}
          variant="standard"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
  
      <FormControl fullWidth>
        <TextField
          id="lastname"
          label="Apellido"
          value={lastname}
          variant="standard"
          onChange={(e) => setLastname(e.target.value)}
        />
      </FormControl>
  
      <FormControl fullWidth>
        <TextField
          id="email"
          label="Correo Electrónico"
          type="email"
          value={email}
          variant="standard"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
  
      <FormControl fullWidth>
        <TextField
          id="income"
          label="Ingresos"
          type="number"
          value={income}
          variant="standard"
          onChange={(e) => setIncome(e.target.value)}
        />
      </FormControl>
  
      <FormControl fullWidth>
        <TextField
          id="password"
          label="Contraseña"
          type="password"
          value={password}
          variant="standard"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
  
      <FormControl fullWidth>
        <TextField
          id="birthDate"
          label="Fecha de Nacimiento"
          type="date"
          value={birthDate}
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </FormControl>
  
      <FormControl fullWidth>
        <TextField
          id="rut"
          label="RUT"
          value={rut}
          variant="standard"
          onChange={(e) => setRut(e.target.value)}
        />
      </FormControl>
  
      <FormControl>
        <br />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          startIcon={<PersonAddIcon />}
        >
          Registrarse
        </Button>
      </FormControl>
  
      {/* Componente de diálogo para mostrar el mensaje de error */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {error} {/* Mensaje de error */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Register;