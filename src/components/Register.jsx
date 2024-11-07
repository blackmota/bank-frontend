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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelCircleIcon from "@mui/icons-material/Cancel";

const Register = () => {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [income, setIncome] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [rut, setRut] = useState("");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const formatRut = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    if (cleanedValue.length <= 1) return cleanedValue;
    const rut = `${cleanedValue.slice(0, -1)}`;
    const dv = cleanedValue.slice(-1);
    const formattedRut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + `-${dv}`;
    return formattedRut;
  };

  const handleRutChange = (e) => {
    const input = e.target.value;
    setRut(formatRut(input));
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatNumber = (value) => {
    return value.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const validateRut = (rut) => {
    const cleanedRut = rut.replace(/\./g, "").replace("-", "");
    const body = cleanedRut.slice(0, -1);
    const dv = cleanedRut.slice(-1).toUpperCase();

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const calculatedDv = 11 - (sum % 11);
    const dvExpected = calculatedDv === 11 ? "0" : calculatedDv === 10 ? "K" : calculatedDv.toString();

    return dv === dvExpected;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleIncomeChange = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatNumber(inputValue);
    setIncome(formattedValue);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!validateRut(rut)) {
      setError("El RUT ingresado no es válido. Por favor, revise e intente de nuevo.");
      setOpen(true);
      return;
    }

    const age = calculateAge(birthDate);
    if (age > 69) {
      setError("La edad máxima permitida para registrarse es de 69 años.");
      setOpen(true);
      return;
    } else if (age < 0) {
      setError("Ingrese una fecha de nacimiento válida.");
      setOpen(true);
      return;
    } else if (age < 18) {
      setError("No se pueden registrar usuarios con menos de 18 años.");
      setOpen(true);
      return;
    }

    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.");
      setOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setOpen(true);
      return;
    }

    setError(null);

    const cleanIncome = parseFloat(income.replace(/\./g, ""));
    const userData = {
      name,
      lastname,
      email,
      income: cleanIncome,
      password,
      birthDate,
      rut,
      role: 1,
    };

    authService
      .register(userData)
      .then((response) => {
        if (!response || response.data === null) {
          setError("El registro falló. Por favor, intente de nuevo.");
          setOpen(true);
          return;
        }
        setError(null);
        const { id, birthDate, role, name, lastname, rut} = response.data;
        localStorage.setItem("id_usuario", id);
        localStorage.setItem("user_name", name);
        localStorage.setItem("user_lastname", lastname);
        localStorage.setItem("user_rut", rut);
        localStorage.setItem("user_birth", birthDate);
        localStorage.setItem("permisos", role);

        navigate("/dashboard");
      })
      .catch((error) => {
        setError("Ya existe un usuario con ese Rut.");
        setOpen(true);
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
          label="Ingresos Mensuales"
          type="text"
          value={income}
          variant="standard"
          onChange={handleIncomeChange}
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
          id="confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          value={confirmPassword}
          variant="standard"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {password === confirmPassword && confirmPassword ? (
          <Box display="flex" alignItems="center" mt={1}>
            <CheckCircleIcon style={{ color: "green", marginRight: "5px" }} />
            <span style={{ color: "green" }}>Las contraseñas coinciden</span>
          </Box>
        ) : password !== confirmPassword && confirmPassword ? (
          <Box display="flex" alignItems="center" mt={1}>
            <CancelCircleIcon style={{ color: "red", marginRight: "5px" }} />
            <span style={{ color: "red" }}>Las contraseñas no coinciden</span>
          </Box>
        ) : null}
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
          onChange={handleRutChange}
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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {error}
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
