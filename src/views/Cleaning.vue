<script setup>
    import { ref, onMounted  } from 'vue';
    import { groupSessions, timeToMinutes } from '@/utils/sessionsOrder';
    import { setDanger, scrollToClosestFilm } from '@/utils/sessionsStatus';
    import axios from 'axios';
    import Film from '@/components/Film.vue'

    const API_URL = import.meta.env.VITE_API_BASE;
    const token = ref('');

    const films = ref([]);
    const filmRefs = ref([]);
    const groupedFilms = ref([]);

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
                if (film.next) {
                    film.danger = setDanger(film.next.start);
                } else {
                    film.danger = 0;
                }
            })

            groupedFilms.value = groupSessions(data);

            return data;
        } catch (error) {
            console.error("❌ Erreur lors de la récupération du JSON :", error);
        }
    }

    async function actualiseData() {
        films.value = await fetchSessions();
        console.log(groupedFilms.value[0][0]);

        if (!groupedFilms.value[0][0]) {
            window.location.href = "/";
        }

        setInterval(async () => {
            films.value = await fetchSessions();
            console.log(groupedFilms.value);

            groupedFilms.value = groupSessions(films.value);
        }, 5000);
    }

    onMounted(() => {
        token.value = localStorage.getItem("authToken");
        
        if (!token.value) {
            window.location.href = "/login";
        }

        actualiseData();

        setTimeout(() => {
            scrollToClosestFilm(films.value, 'end')
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