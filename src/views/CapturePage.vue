<script setup>
    import { ref } from "vue";
    import { onMounted } from 'vue';
    import { GoogleGenerativeAI } from "@google/generative-ai";
    import axios from 'axios';

    const API_URL = import.meta.env.VITE_API_BASE;
    const token = ref('')

    onMounted(() => {
        token.value = localStorage.getItem("authToken");
        
        if (!token.value) {
            window.location.href = "/login";
        }
    });

    const files = ref([]);

    

    const handleFileUpload = (event) => {
        files.value = Array.from(event.target.files);
    };

    const processImages = async () => {
        for (let i = 0; i < files.value.length; i++) {
            const formdata = new FormData();
            formdata.append("image", files.value[i]);

            try {
                const response = await axios.post(`${API_URL}/sessions`, formdata, {
                    "Authorization": `Bearer ${token.value}`,
                    "Content-Type": "multipart/form-data"
                });

                const data = response.data;

                console.log(data);
            } catch (error) {
                console.log("message:", error);
            }
        }

        window.location.href = "/cleaning";
    }

</script>

<template>
    <div>
      <input type="file" multiple accept="image/*" @change="handleFileUpload" />
      <button @click="processImages()" :disabled="files.length === 0 || isLoading">
        Envoyer
      </button>
  
      <!-- <div v-if="finalResponse">
        <h3>Résultat final :</h3>
        <pre>{{ JSON.stringify(finalResponse, null, 2) }}</pre>
      </div> -->
    </div>
</template>

  