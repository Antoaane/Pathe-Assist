<script setup>
    import { ref } from "vue";
    import { onMounted } from 'vue';
    import axios from 'axios';
    import { verifyToken } from '@/utils/login'

    const API_URL = import.meta.env.VITE_API_BASE;
    const token = ref('')

    onMounted(() => {
        token.value = localStorage.getItem("authToken");
        
        if (!verifyToken(token.value)) {
            window.location.href = "/login";
        }
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

            window.location.href = "/cleaning";
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
        } catch (error) {
            console.error(error);
        }
    }

</script>

<template>
    <div>
      <input type="file" multiple accept="image/*" @change="handleFileUpload" />
      <button @click="processImages()" :disabled="files.length === 0">
        Envoyer
      </button>
  
      <!-- <div v-if="finalResponse">
        <h3>Résultat final :</h3>
        <pre>{{ JSON.stringify(finalResponse, null, 2) }}</pre>
      </div> -->
    </div>
    <button @click="clearSessions()">Clear Sessions</button>
</template>

  