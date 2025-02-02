<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import { groupSessions, timeToMinutes } from '@/utils/sessionsOrder';
    import { setDanger, scrollToClosestFilm, setupWebSocket, cleanupWebSocket } from '@/utils/sessionsStatus';
    import { verifyToken } from '@/utils/login'
    import axios from 'axios';
    import Film from '@/components/Film.vue'

    const API_URL = import.meta.env.VITE_API_BASE;
    const token = ref('');

    const props = defineProps({
        mode: String
    })

    const mode = props.mode;

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
                    film.danger = setDanger(mode == 'cleared' ? film.next.start : film.start, film.play);
                } else {
                    film.danger = 0;
                }
            })

            films.value = data;
            groupedFilms.value = groupSessions(data, mode == 'cleared' ? 'end' : 'start');

            console.log(groupedFilms.value);

            if (!groupedFilms.value[0][0] || !films.value) {
                window.location.href = "/capture";
            }
        } catch (error) {
            console.error("❌ Erreur lors de la récupération du JSON :", error);
        }
    }

    onMounted(() => {
        token.value = localStorage.getItem("authToken");
        
        if (!verifyToken(token.value)) {
            window.location.href = "/login";
        };

        setupWebSocket(fetchSessions);

        setTimeout(() => {
            scrollToClosestFilm(films.value, mode == 'cleared' ? 'end' : 'start')
        }, 750);

        setInterval(async () => {
            await fetchSessions();
        }, 30000);
    });

    onUnmounted(() => {
        cleanupWebSocket();
    });
</script>

<template>
    <div class="container">
        <div v-for="group in groupedFilms" class="card-group">
            <Film v-for="film in group" :ref="filmRefs" :film="film" :mode="mode" />
        </div>
    </div>
</template>