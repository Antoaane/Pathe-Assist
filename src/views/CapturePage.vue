<template>
    <div>
      <input type="file" multiple accept="image/*" @change="handleFileUpload" />
      <button @click="processImages()" :disabled="files.length === 0 || isLoading">
        Envoyer
      </button>
  
      <div v-if="finalResponse">
        <h3>Résultat final :</h3>
        <pre>{{ JSON.stringify(finalResponse, null, 2) }}</pre>
      </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const githubToken = import.meta.env.VITE_GITHUB_API_TOKEN;
const API_KEY = "AIzaSyCHJhMchgEq_c8Bk3PXjG-E-7rrjrfgkKI"; // Remplace par ta clé API Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

const files = ref([]);
const responses = ref([]);
const finalResponse = ref(null);
const isLoading = ref(false);

const handleFileUpload = (event) => {
    files.value = Array.from(event.target.files);
    responses.value = [];
    finalResponse.value = null;
};

const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]); // Supprime le préfixe "data:image/*;base64,"
        reader.onerror = (error) => reject(error);
    });
};

const extractJson = (responseText) => {
    try {
        // Supprime les balises Markdown si présentes
        const cleanedText = responseText
        .replace(/```json/g, "") // Supprime ```json
        .replace(/```/g, ""); // Supprime ```
        
        // Tente de parser le JSON propre
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Erreur de parsing JSON :", error);
        return null;
    }
};

const sendImageToGemini = async (base64Image, prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const result = await model.generateContent([
            prompt, { 
                inlineData: { 
                    mimeType: "image/jpeg", 
                    data: base64Image 
                } 
            },
        ]);
        
        console.log(result.response);
        return extractJson(result.response.text());
    } catch (error) {
        console.error("Erreur Gemini :", error);
        return null;
    }
};

function removeDuplicates(jsonArray) {
    const uniqueItems = new Map();

    jsonArray.forEach(item => {
        // On génère une clé unique pour chaque élément en concaténant ses valeurs
        const key = JSON.stringify(item);
        uniqueItems.set(key, item); // Seul l'élément unique est conservé
    });

    return Array.from(uniqueItems.values()); // Retourne un tableau d'objets uniques
}

async function processImages() {
    isLoading.value = true;
    responses.value = [];

    for (let i = 0; i < files.value.length; i++) {
        const file = files.value[i];
        const prompt = `Analyse de l'image. Récupères TOUTES les lignes du tableau de l'image jointe et que tu me les transformes en des objets JSON ayant les caractéristiques suivantes : name, room, ban, start, play, end. Pour les salles, note uniquement le numéro ou nom de la salle (exemple : "8, IMAX, etc" et non "salle 8, salle IMAX etc"). Pour les ban, cela correspond simplement à la colonne des interdictions. Inscris-y simplement ce que tu y vois d'écrit.

        Exemple :
        [
            {
                "name": "Le Seigneur des Anneaux: La Guerre des Rohirrim",
                "room": "11",
                "ban" : "-12, etc"
                "start": "16:45",
                "play": "17:05",
                "end": "19:19"
            },
            {
                "name": "Vaiana 2",
                "room": "9",
                "ban" : "TP"
                "start": "17:30",
                "play": "17:50",
                "end": "19:29"
            },
            {
                etc...
            },
        ]`;

        try {
            const base64Image = await convertFileToBase64(file);
            const jsonResponse = await sendImageToGemini(base64Image, prompt);

            if (jsonResponse) responses.value.push(...jsonResponse);

            console.log(jsonResponse);
        } catch (error) {
            console.error(`Erreur avec ${file.name} :`, error);
        }
    }

    finalResponse.value = await removeDuplicates(responses.value);
    isLoading.value = false;

    console.log(finalResponse.value);
    updateGitHubJson(finalResponse.value);
};

async function updateGitHubJson(newData) {
    const apiUrl = `https://api.github.com/repos/Antoaane/Pathe-Pattern/contents/pattern.json`;

    try {
        // Obtenir le SHA du fichier JSON existant (nécessaire pour la mise à jour)
        const response = await axios.get(apiUrl, {
            headers: { Authorization: `token ${githubToken}` }
        });

        const sha = response.data.sha; // SHA de l'ancienne version

        // Encoder les nouvelles données JSON
        const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify(newData, null, 2))));

        // Mettre à jour le fichier sur GitHub
        await axios.put(apiUrl, {
            message: "Mise à jour automatique du fichier JSON",
            content: encodedContent,
            sha, // Nécessaire pour écraser l'ancien fichier
            branch: 'main'
        }, {
            headers: { Authorization: `token ${githubToken}` }
        });

        console.log("✅ Fichier JSON mis à jour avec succès sur GitHub !");
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour :", error.response ? error.response.data : error);
    }
}
</script>
  