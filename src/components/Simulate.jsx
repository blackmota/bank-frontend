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

  const handleCalculate = (e) => {
    e.preventDefault();

    const loanData = {
      loanAmount: parseFloat(loanAmount),
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
            type="number"
            value={loanAmount}
            variant="standard"
            onChange={(e) => setLoanAmount(e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="rate"
            label="Tasa de Interés (%)"
            type="number"
            value={rate}
            variant="standard"
            onChange={(e) => setRate(e.target.value)}
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
            <h4>El pago mensual de su simulacion es de: {Math.round(result)} $CLP/Mes</h4>
          </div>
        )}

        {error && (
          <div style={{ color: "red" }}>
            <h4>Error: {error}</h4>
          </div>
        )}
      </Box>
    )} else {
      return (
        <div>
          <h3> Debes iniciar sesión para acceder a la calculadora de préstamos </h3>
        </div>
      );
    }
  };

  export default LoanCalculator;
