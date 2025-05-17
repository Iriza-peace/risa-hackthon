import axios from "axios";

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
});

export default httpClient;