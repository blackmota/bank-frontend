import httpClient from "../http-common";
import axios from "axios";
const saveDocument = (document) => {
    return httpClient.post('/api/document/upload',document);
}

const getDocumentByTicket = (TicketId) => {
    return httpClient.get(`/api/document/all/${TicketId}`, { responseType: 'blob' });
}
export default { saveDocument , getDocumentByTicket};