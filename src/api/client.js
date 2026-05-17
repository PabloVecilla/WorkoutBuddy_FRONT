import axios from "axios"; 
const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({ // --> creates an axios instance, reusable for each request
    baseURL: API_URL,
    withCredentials: true, // --> vital for httpOnly jwt token cookie
    headers: {
        "Content-type": "application/json"
    }
}); 

export default apiClient; 