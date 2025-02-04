import axios from 'axios'
import { onMounted } from 'vue';
import { saveLocalStorage, getLocalStorage } from '@/utils/tools';

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
            saveLocalStorage("authToken", data.newToken, 72);
            window.location.href = "/cleaning";
        }

    } catch (error) {
        console.log("message:", error);
    }
}

export async function verifyToken() {

    const token = getLocalStorage('authToken');

    try {
        const response = await axios.get(`${API_URL}/token`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });
        
        console.log(response);

        saveLocalStorage("authToken", token, 72);

        return true;

    } catch (error) {
        console.log(error.status);
        return false;
    }
}

export function logout() {
    localStorage.removeItem("authToken");

    window.location.href = `${VITE_URL}/login`;
}
