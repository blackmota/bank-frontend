import { useState } from "react";
import loanService from "../services/loan.service"; // Asegúrate de tener el servicio de loan
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import CalculateIcon from "@mui/icons-material/Calculate";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null); // Para almacenar el resultado de la llamada al backend
  const [error, setError] = useState(null); // Para almacenar el mensaje de error

  const formatNumber = (value) => {
    // Convierte el valor a número y lo formatea
    return value.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const handleLoanAmountChange = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatNumber(inputValue);
    setLoanAmount(formattedValue);
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    // Eliminar los puntos de formato para el cálculo
    const cleanLoanAmount = parseFloat(loanAmount.replace(/\./g, ""));
    
    // Verificar que todos los campos estén completos
    if (!cleanLoanAmount || !rate || !years) {
      setError("Por favor, completa todos los campos.");
      setResult(null);
      return; // Salir de la función si falta información
    }

    if (rate < 0 || rate > 15) {
      setError("La tasa de interés debe ser un valor entre 3.5 y 7 por ciento.");
      setResult(null);
      return; // Salir de la función si la tasa no es válida
    }

    if ( years < 1 || years > 30) {
      setError("El plazo del préstamo debe ser entre 1 y 30 años.");
      setResult(null);
      return; // Salir de la función si el plazo no es válido
    }

    const loanData = {
      loanAmount: cleanLoanAmount,
      rate: parseFloat(rate),
      years: parseInt(years),
    };

    console.log("Calculando con:", loanData);

    loanService
      .calculateLoan(loanData) // Asumiendo que este es tu método en el servicio
      .then((response) => {
        if (response && response.data) {
          setResult(response.data); // Asumir que el backend devuelve el número esperado
          setError(null); // Limpiar cualquier error anterior
        } else {
          setError("No se recibió un resultado válido.");
          setResult(null);
        }
      })
      .catch((error) => {
        console.log("Error en la cálculo del préstamo:", error);
        setError("Ocurrió un error al calcular el préstamo.");
        setResult(null);
      });
  };

  if (localStorage.getItem("id_usuario") != null) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        component="form"
        onSubmit={handleCalculate}
      >
        <h3> Calculadora de Préstamos </h3>
        <hr />

        <FormControl fullWidth>
          <TextField
            id="loanAmount"
            label="Monto del Préstamo"
            type="text" // Cambiar a texto para que permita el formato
            value={loanAmount}
            variant="standard"
            onChange={handleLoanAmountChange} // Usar el nuevo manejador
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="rate"
            label="Tasa de Interés % (Ej: 4.5))"
            type="number"
            value={rate}
            variant="standard"
            onChange={(e) => setRate(e.target.value)}
            inputProps={{ min: "0", step: "0.1" }}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="years"
            label="Número de Años"
            type="number"
            value={years}
            variant="standard"
            onChange={(e) => setYears(e.target.value)}
            inputProps={{ min: "0", step: "1" }}
          />
        </FormControl>

        <FormControl>
          <br />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<CalculateIcon />}
          >
            Calcular
          </Button>
        </FormControl>

        {result !== null && (
          <div>
            <h4>La cuota mensual de su credito simulado es de: {Math.round(result).toLocaleString('es-ES')} $CLP/Mes</h4>
          </div>
        )}

        {error && (
          <div style={{ color: "red" }}>
            <h4>Error: {error}</h4>
          </div>
        )}
      </Box>
    );
  } else {
    return (
      <div>
        <h3> Debes iniciar sesión para acceder a la calculadora de préstamos </h3>
      </div>
    );
  }
};

export default LoanCalculator;
