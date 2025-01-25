<script setup>
import { ref, onMounted  } from 'vue';
import { groupSessions, timeToMinutes } from '@/utils/sessionsOrder';
import { setDanger } from '@/utils/sessionsStatus';
import axios from 'axios';
import Film from '@/components/Film.vue'

const API_URL = import.meta.env.VITE_API_BASE;
const token = ref('')

const films = ref([]);
const filmRefs = ref([]);
const groupedFilms = ref([]);

function scrollToClosestFilm() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let closestFilm = null;
    let closestDiff = Infinity;

    films.value.forEach(film => {
        const filmEndTime = timeToMinutes(film.start);
        const diff = filmEndTime - currentMinutes;

        if (diff >= 0 && diff < closestDiff) {
            closestDiff = diff;
            closestFilm = film;
        }
    });

    if (closestFilm) {
        console.log("🎯 Film le plus proche :", closestFilm.id);
        // Récupérer la référence de l'élément DOM correspondant
        const filmElement = document.getElementById(`film-${closestFilm.id}`);
        if (filmElement) {
            filmElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
}

const fetchSessions = async () => {
    try {
        const response = await axios.get(`${API_URL}/sessions`, {
            headers: {
                "Authorization": `Bearer ${token.value}`,
                "Accept": "application/json"
            }
        });

        const data = response.data;

        data.forEach((film) => {
            film.danger = setDanger(film.start);
        })

        groupedFilms.value = groupSessions(data);

        return data;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du JSON :", error);
    }
}

async function actualiseData() {
    films.value = await fetchSessions();
    console.log(films.value);

    setInterval(async () => {
        films.value = await fetchSessions();
        console.log(films.value);

        groupedFilms.value = groupSessions(films.value);
    }, 5000);
}

onMounted(() => {
    token.value = localStorage.getItem("authToken");
    
    if (!token.value) {
        window.location.href = "/login";
    }

    actualiseData()

    setTimeout(() => {
        scrollToClosestFilm()
    }, 750);
});
</script>

<template>
    <div class="container">
        <div v-for="group in groupedFilms" class="card-group">
            <Film v-for="film in group" :ref="filmRefs" :film="film" mode="cleaning"/>
        </div>
    </div>
</template>