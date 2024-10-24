import httpClient from "../http-common";

const registerTicket = (ticket) => {
    return httpClient.post('/api/ticket/save', ticket);
}

const getTicketById = (id) => {
    return httpClient.get(`/api/ticket/getByID/${id}`);
}

const getByUser = (user) => {
    console.log(user);
    return httpClient.get(`/api/ticket/get/${user}`);
}

const cancelTicket = (ticket) => {
    return httpClient.post(`/api/ticket/cancel`, ticket);
}

const setStep = (ticket) => {
    return httpClient.post(`/api/ticket/step`, ticket);
}

const acceptTicketExecutive = (ticket) => {
    return httpClient.post(`/api/ticket/accept/executive`, ticket);
}

const aproveTicket = (ticket) => {
    return httpClient.post(`/api/ticket/aprove`, ticket);
}

const rejectTicket = (ticket) => {
    return httpClient.post(`/api/ticket/reject`, ticket);
}

const acceptUser = (ticket) => {
    return httpClient.post(`/api/ticket/accept/user`, ticket);
}

const saveTicket = (ticket) => {
    return httpClient.post(`/api/ticket/saveticket`, ticket);
}

const getTickets = () => {
    return httpClient.get(`/api/ticket/get/worker`);
}

const validater1 = (income,fee) => {
    return httpClient.get(`/api/ticket/validate/r1/${income}/${fee}`);
}

const validater3 = (seniority, independant) => {
    return httpClient.get(`/api/ticket/validate/r3/${seniority}/${independant}`);
}

const validater4 = (fee,debt,income) => {
    return httpClient.get(`/api/ticket/validate/r4/${fee}/${debt}/${income}`);
}

const validater5 = (Amount,type,valuation) => {
    return httpClient.get(`/api/ticket/validate/r5/${Amount}/${type}/${valuation}`);
}

const validater6 = (birth,years) => {
    return httpClient.get(`/api/ticket/validate/r6/${birth}/${years}`);
}

const validater7 = (r1,r2,r3,r4,r5) => {
    return httpClient.get(`/api/ticket/validate/r7/${r1}/${r2}/${r3}/${r4}/${r5}`);
}



export default { getTicketById, registerTicket, getByUser, cancelTicket, rejectTicket, setStep, aproveTicket, acceptUser, acceptTicketExecutive, saveTicket, getTickets, validater1, validater3, validater4, validater5, validater6, validater7};

