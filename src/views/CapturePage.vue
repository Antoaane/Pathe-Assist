<script setup>
    import { ref } from "vue";
    import { onMounted } from 'vue';
    import axios from 'axios';
    import { verifyToken, logout } from '@/utils/login'
    import { getLocalStorage } from "@/utils/tools";
    import LoadingScreen from "@/components/LoadingScreen.vue"
    import ValidationScreen from "@/components/ValidationScreen.vue"

    const API_URL = import.meta.env.VITE_API_BASE;
    const VITE_URL = import.meta.env.VITE_URL;

    const isLoading = ref(false);
    const isValidate = ref(false);
    const action = ref();
    const files = ref([]);

    onMounted(async () => {
        handleFileName()
    });

    const handleFileUpload = (event) => {
        files.value = Array.from(event.target.files);
    };

    const processImages = async () => {
        isLoading.value = true;

        try {
            for (let i = 0; i < files.value.length; i++) {
                const formdata = new FormData();
                formdata.append("image", files.value[i]);

                try {
                    const response = await axios.post(`${API_URL}/sessions`, formdata, {
                        headers: {
                            "Authorization": `Bearer ${await getLocalStorage('authToken')}`,
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

        isLoading.value = false;
    }

    const clearSessions = async () => {
        isLoading.value = true;

        try {
            const response = await axios.get(`${API_URL}/sessions/reset`, {
                headers: {
                    "Authorization": `Bearer ${await getLocalStorage('authToken')}`,
                    "Accept": "application/json"
                }
            });

            localStorage.removeItem('sessions');

            console.log(response.data);
            window.location.href = `${VITE_URL}/capture`;
        } catch (error) {
            console.error(error);
        }

        isLoading.value = false;
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

    const setAction = (fnctn) => {
        isValidate.value = true;
        action.value = fnctn;
    }

    const validate = (state) => {
        if (state) {
            action.value();
            isValidate.value = false;
        } else {
            isValidate.value = false;
        }
    }

</script>

<template>
    <LoadingScreen v-if="isLoading" />
    <ValidationScreen v-if="isValidate" @validate="validate" />
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
            <button class="logout-btn" @click="setAction(logout)">Se déconnecter</button>
            <button class="clear-btn" @click="setAction(clearSessions)">Effacer les sessions</button>
        </div>
    </div>
</template>

  