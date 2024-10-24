import httpClient from "../http-common"; // Asegúrate de tener configurado tu httpClient


const calculateLoan = (loanData) => {
    return httpClient.get(`/api/loan/calculate/${loanData.loanAmount}/${loanData.rate}/${loanData.years}`); // Ajusta la URL según tu API
}

const calculateTotalAmount = (loan,interest,years) => {
    return httpClient.get(`/api/loan/calculateTotal/${loan}/${interest}/${years}`); // Ajusta la URL según tu API
}


export default {calculateLoan, calculateTotalAmount};