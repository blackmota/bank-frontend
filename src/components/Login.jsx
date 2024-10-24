import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/user.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import LoginIcon from "@mui/icons-material/Login";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Iniciando sesión con:", username);
    authService
      .login(username, password)
      .then((response) => {
        if (!response || response.data === null) {
          console.log("El inicio de sesión falló. El servicio retornó null.");
          setErrorMessage("Usuario o contraseña incorrecta."); // Setea el mensaje de error
          return;
        }
        console.log("Login exitoso.", response.data);
        setErrorMessage(null);
        // Suponiendo que response.data contiene los campos necesarios
        const { id, income, birthDate, role } = response.data;

        // Guardar datos en localStorage
        localStorage.setItem("id_usuario", id);
        localStorage.setItem("income", income);
        localStorage.setItem("user_birth", birthDate);
        localStorage.setItem("permisos",role);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log("Error en el inicio de sesión.", error);
        setErrorMessage("Usuario o contraseña incorrecta."); // Setea el mensaje de error
      });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      component="form"
      onSubmit={handleLogin}
    >
      <h3> Iniciar Sesión </h3>
      <hr />

      <FormControl fullWidth>
        <TextField
          id="username"
          label="Usuario"
          value={username}
          variant="standard"
          onChange={(e) => setUsername(e.target.value)}
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

      {errorMessage && ( // Muestra el mensaje de error si existe
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )}

      <FormControl>
        <br />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginLeft: "0.5rem" }}
          startIcon={<LoginIcon />}
        >
          Iniciar Sesión
        </Button>
      </FormControl>
    </Box>
  );
};

export default Login;
