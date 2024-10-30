import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/user.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import LoginIcon from "@mui/icons-material/Login";

const Login = () => {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    authService
      .login(rut, password)
      .then((response) => {
        if (!response || response.data === null) {
          setErrorMessage("Usuario o contraseña incorrecta.");
          return;
        }
        const { id, income, birthDate, role } = response.data;
        localStorage.setItem("id_usuario", id);
        localStorage.setItem("income", income);
        localStorage.setItem("user_birth", birthDate);
        localStorage.setItem("permisos", role);
        navigate("/dashboard");
      })
      .catch((error) => {
        setErrorMessage("Usuario o contraseña incorrecta.");
      });
  };

  const formatRut = (value) => {
    // Elimina todos los caracteres no numéricos
    const cleanedValue = value.replace(/\D/g, "");
    
    if (cleanedValue.length <= 1) return cleanedValue;

    // Aplica el formato del RUT chileno
    const rut = `${cleanedValue.slice(0, -1)}`;
    const dv = cleanedValue.slice(-1);

    const formattedRut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + `-${dv}`;
    return formattedRut;
  };

  const handleRutChange = (e) => {
    const input = e.target.value;
    setRut(formatRut(input));
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
      <h3>Iniciar Sesión</h3>
      <hr />

      <FormControl fullWidth>
        <TextField
          id="rut"
          label="Ingrese su RUT"
          value={rut}
          variant="standard"
          onChange={handleRutChange}
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

      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>
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
