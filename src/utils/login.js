import axios from 'axios'
import { onMounted } from 'vue';

const API_URL = import.meta.env.VITE_API_BASE;
const VITE_URL = import.meta.env.VITE_URL;

export async function login(cinemaId, password) {
    try {
        const response = await axios.post(`${API_URL}/login`,
            {
                "cinemaId": cinemaId,
                "password": password
            },
            {
                "Content-Type": "application/json",
            }
        )
        
        const data = response.data;
        console.log(response);

        if (data.newToken) {
            localStorage.setItem("authToken", data.newToken);
            window.location.href = "/";
        }

    } catch (error) {
        console.log("message:", error);
    }
}

export async function verifyToken(token) {
    try {
        const response = await axios.get(`${API_URL}/token`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });
        
        console.log(response)

        return true;

    } catch (error) {
        console.log(error.status);
        window.location.href = "/login";
    }
}
