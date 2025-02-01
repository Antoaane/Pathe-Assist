<script setup>
    import { ref } from "vue";
    import { onMounted } from 'vue';
    import axios from 'axios';
    import { verifyToken, logout } from '@/utils/login'

    const API_URL = import.meta.env.VITE_API_BASE;
    const VITE_URL = import.meta.env.VITE_URL;
    const token = ref('')

    onMounted(async () => {
        try {
            const response = await axios.get(`${API_URL}/`, {
                headers: {
                    // "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            
            console.log("test :", response);
        } catch (error) {
            console.log(error);
        }

        token.value = localStorage.getItem("authToken");
        
        if (!verifyToken(token.value)) {
            window.location.href = "/login";
        }

        handleFileName()
    });

    const files = ref([]);

    const handleFileUpload = (event) => {
        files.value = Array.from(event.target.files);
    };

    const processImages = async () => {
        try {
            for (let i = 0; i < files.value.length; i++) {
                const formdata = new FormData();
                formdata.append("image", files.value[i]);

                try {
                    const response = await axios.post(`${API_URL}/sessions`, formdata, {
                        headers: {
                            "Authorization": `Bearer ${token.value}`,
                            "Content-Type": "multipart/form-data"
                        }
                    });

                    const data = response.data;

                    console.log(data);
                } catch (error) {
                    console.log("message:", error);
                }
            }

            window.location.href = `${VITE_URL}/cleaning`;
        } catch (err) {
            console.error(err);
        }
    }

    const clearSessions = async () => {
        try {
            const response = await axios.get(`${API_URL}/sessions/reset`, {
                headers: {
                    "Authorization": `Bearer ${token.value}`,
                    "Accept": "application/json"
                }
            });

            console.log(response.data);
            window.location.href = VITE_URL;
        } catch (error) {
            console.error(error);
        }
    }

    function handleFileName() {
        document.getElementById('fileInput').addEventListener('change', function(event) {
            const fileNameDisplay = document.getElementById('file-name');
            if (this.files.length > 0) {
                fileNameDisplay.textContent = Array.from(this.files).map(file => file.name).join(', ');
            } else {
                fileNameDisplay.textContent = 'Aucun fichier sélectionné';
            }
        });
    }
</script>

<template>
    <div class="capture-container">
        <span></span>
        <div class="file-container">
            <input id="fileInput" type="file" multiple accept="image/*" @change="handleFileUpload" />
            <span id="file-name">Aucun fichier sélectionné</span>
            <label for="fileInput" class="file-btn">Sélectionner les images</label>
            <button class="send-btn" @click="processImages()" :disabled="files.length === 0">
                Envoyer
            </button>
        </div>
        <div class="undo-container">
            <button class="logout-btn" @click="logout()">Se déconnecter</button>
            <button class="clear-btn" @click="clearSessions()">Effacer les sessions</button>
        </div>
    </div>
</template>

  