<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import { groupSessions, timeToMinutes } from '@/utils/sessionsOrder';
    import { setDanger, scrollToClosestFilm } from '@/utils/sessionsStatus';
    import { verifyToken } from '@/utils/login'
    import axios from 'axios';
    import Film from '@/components/Film.vue'

    const API_URL = import.meta.env.VITE_API_BASE;
    const token = ref('');

    const props = defineProps({
        mode: String
    })

    const mode = props.mode;
    let socket = null;

    const films = ref([]);
    const filmRefs = ref([]);
    const groupedFilms = ref([]);

    function setupWebSocket() {
        socket = new WebSocket('ws://localhost:5000'); 

        // Quand le WebSocket est ouvert
        socket.onopen = () => {
            console.log('Connexion WebSocket établie.');
        };

        // Quand un message est reçu
        socket.onmessage = (event) => {
            fetchSessions();
        };

        // Quand le WebSocket est fermé
        socket.onclose = () => {
            console.log('Connexion WebSocket fermée.');
        };

        // En cas d'erreur
        socket.onerror = (error) => {
            console.error('Erreur WebSocket :', error);
        };
    }

    function cleanupWebSocket() {
        if (socket) {
            socket.close(); // Fermer la connexion
            console.log('Connexion WebSocket nettoyée.');
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
                if (film.next) {
                    film.danger = setDanger(film.next.start, film.play);
                } else {
                    film.danger = 0;
                }
            })

            films.value = data;
            groupedFilms.value = groupSessions(data, mode == 'cleared' ? 'end' : 'start');

            console.log(groupedFilms.value);

            if (!groupedFilms.value[0][0] || !films.value) {
                window.location.href = "/";
            }
        } catch (error) {
            console.error("❌ Erreur lors de la récupération du JSON :", error);
        }
    }

    onMounted(() => {
        token.value = localStorage.getItem("authToken");
        
        verifyToken(token.value);

        setupWebSocket();

        setTimeout(() => {
            scrollToClosestFilm(films.value, mode == 'cleared' ? 'end' : 'start')
        }, 750);
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