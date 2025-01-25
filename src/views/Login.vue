<script setup>
    import { ref } from 'vue';
    import axios from 'axios'

    const API_URL = import.meta.env.VITE_API_BASE;

    const cinemaId = ref('');
    const password = ref('');

    const login = async () => {
        try {
            const response = await axios.post(`${API_URL}/login`,
                {
                    "cinemaId": cinemaId.value,
                    "password": password.value
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

</script>

<template>
    <div>
        <input type="text" name="cinema" placeholder="Identifiant" v-model="cinemaId">
        <input type="text" name="password" placeholder="Mot de passe" v-model="password">
        <button @click="login()">
            Se connecter
        </button>
    </div>
</template>
