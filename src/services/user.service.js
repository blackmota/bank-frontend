import httpClient from "../http-common";

const login = (username, password) => {
    return httpClient.get("/api/user/login", {
        params: {
            rut: username,
            password: password
        }
    });
};

const register = (user) => {
    return httpClient.post("/api/user/", user);
};

const getUser = (idUser) => {
    return httpClient.get(`/api/user/${idUser}`);
}

export default { login , register, getUser};