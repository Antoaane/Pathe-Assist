<template>
    <div>
      <input type="file" multiple accept="image/*" @change="handleFileUpload" />
      <button @click="processImages" :disabled="files.length === 0 || isLoading">
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

const processImages = async () => {
    isLoading.value = true;
    responses.value = [];

    for (let i = 0; i < files.value.length; i++) {
        const file = files.value[i];
        const prompt = `Analyse de l'image. Récupères TOUTES les lignes du tableau de l'image jointe et que tu me les transformes en des objets JSON ayant les caractéristiques suivantes : name, room, ban, start, play, end. Pour les ban, cela correspond simplement à la colonne des interdictions. Inscris-y simplement ce que tu y vois d'écrit.

        Exemple :
        [
            {
                "name": "Le Seigneur des Anneaux: La Guerre des Rohirrim",
                "room": "SALLE 11",
                "ban" : "-12, etc"
                "start": "16:45",
                "play": "17:05",
                "end": "19:19"
            },
            {
                "name": "Vaiana 2",
                "room": "SALLE 9",
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
};
</script>
  