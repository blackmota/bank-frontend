import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loanService from "../services/loan.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import CalculateIcon from "@mui/icons-material/Calculate";

const loanConditions = {
  "Primera Vivienda": {
    plazoMaximo: "30 años",
    tasaInteres: "3.5% - 5.0%",
    montoMaximo: "80% del valor de la propiedad",
    requisitos: [
      "Comprobante de ingresos",
      "Certificado de avalúo",
      "Historial crediticio"
    ],
  },
  "Segunda Vivienda": {
    plazoMaximo: "20 años",
    tasaInteres: "4.0% - 6.0%",
    montoMaximo: "70% del valor de la propiedad",
    requisitos: [
      "Comprobante de ingresos",
      "Certificado de avalúo",
      "Escritura de la primera vivienda",
      "Historial crediticio"
    ],
  },
  "Propiedades Comerciales": {
    plazoMaximo: "25 años",
    tasaInteres: "5.0% - 7.0%",
    montoMaximo: "60% del valor de la propiedad",
    requisitos: [
      "Estado financiero del negocio",
      "Comprobante de ingresos",
      "Certificado de avalúo",
      "Plan de negocios"
    ],
  },
  "Remodelación": {
    plazoMaximo: "15 años",
    tasaInteres: "4.5% - 6.0%",
    montoMaximo: "50% del valor actual de la propiedad",
    requisitos: [
      "Comprobante de ingresos",
      "Presupuesto de la remodelación",
      "Certificado de avalúo actualizado"
    ],
  },
};

const LoanCalculator = () => {
  const [loanType, setLoanType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatNumber = (value) => {
    return value.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const handleLoanAmountChange = (e) => {
    const inputValue = e.target.value;
    const formattedValue = formatNumber(inputValue);
    setLoanAmount(formattedValue);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const cleanLoanAmount = parseFloat(loanAmount.replace(/\./g, ""));

    if (!loanType || !cleanLoanAmount || !rate || !years) {
      setError("Por favor, completa todos los campos.");
      setResult(null);
      return;
    }

    const loanData = {
      loanType,
      loanAmount: cleanLoanAmount,
      rate: parseFloat(rate),
      years: parseInt(years),
    };

    loanService
      .calculateLoan(loanData)
      .then((response) => {
        if (response && response.data) {
          setResult(response.data);
          setError(null);
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

  const renderLoanConditions = () => {
    if (!loanType) return null;
    const conditions = loanConditions[loanType];
    return (
      <div style={{ marginTop: "10px", textAlign: "left" }}>
        <p><strong>Plazo Máximo:</strong> {conditions.plazoMaximo}</p>
        <p><strong>Tasa de Interés:</strong> {conditions.tasaInteres}</p>
        <p><strong>Monto Máximo:</strong> {conditions.montoMaximo}</p>
        <p><strong>Requisitos Documentales:</strong></p>
        <ul>
          {conditions.requisitos.map((requisito, index) => (
            <li key={index}>{requisito}</li>
          ))}
        </ul>
      </div>
    );
  };

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
      <h4>Tipo de préstamo</h4>
      <FormControl fullWidth>
        <InputLabel id="loanTypeLabel">Tipo</InputLabel>
        <Select
          labelId="loanTypeLabel"
          id="loanType"
          value={loanType}
          onChange={(e) => setLoanType(e.target.value)}
        >
          <MenuItem value="Primera Vivienda">Primera Vivienda</MenuItem>
          <MenuItem value="Segunda Vivienda">Segunda Vivienda</MenuItem>
          <MenuItem value="Propiedades Comerciales">Propiedades Comerciales</MenuItem>
          <MenuItem value="Remodelación">Remodelación</MenuItem>
        </Select>
      </FormControl>
      {!loanType &&
        <div style={{ marginTop: "10px" }}>
          <strong>Seleccione el tipo de prestamo que desea simular.</strong>
        </div>
      }
      {renderLoanConditions()}
      {loanType && <>
        <FormControl fullWidth>
          <TextField
            id="loanAmount"
            label="Monto del Préstamo"
            type="text"
            value={loanAmount}
            variant="standard"
            onChange={handleLoanAmountChange}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="rate"
            label="Tasa de Interés % (Ej: 4.5)"
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
            inputProps={{ min: "1", max: "30", step: "1" }}
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
            Calcular credito
          </Button>
        </FormControl>
      </>}
      {result !== null && (
        <div>
          <h4>La cuota mensual de su crédito simulado es de: {Math.round(result).toLocaleString('es-ES')} $CLP/Mes</h4>
          <p>Otros costos asociados al credito son los siguientes:</p>
          <p><strong>Comision por administracion: </strong> {(parseFloat(loanAmount.replace(/\./g, "")) * 0.01).toLocaleString("es-ES")} CLP (1% del monto total solicitado)</p>
          <p><strong>Seguro de desgravamen: </strong> {(Math.round(parseFloat(loanAmount.replace(/\./g, "")) * 0.0003)).toLocaleString("es-ES")} CLP (0.03% del monto total solicitado mensualmente)</p>
          <p><strong>Seguro de incendios: </strong> 20.000 CLP (Costo fijo mensual)</p>
          <strong>Si desea continuar con la solicitud de este credito, por favor presione el boton de Formulario de Solicitud.</strong>
          <p>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/solicitation")}
            > Formulario de Solicitud
            </Button>
          </p>
        </div>
      )}

      {error && (
        <div style={{ color: "red" }}>
          <h4>Error: {error}</h4>
        </div>
      )}
    </Box>
  );
};

export default LoanCalculator;
