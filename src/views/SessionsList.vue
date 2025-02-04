<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import { timeToMinutes  } from '@/utils/tools';
    import { fetchSessions, organizeSessions } from '@/utils/sessions';
    import { setupWebSocket, cleanupWebSocket } from '@/utils/webSocket';
    import { verifyToken } from '@/utils/login'
    import Film from '@/components/Film.vue'

    const token = ref('');

    const props = defineProps({
        mode: String
    })

    const mode = props.mode;
    const films = ref([]);
    const filmRefs = ref([]);

    function scrollToClosestFilm(sessions, timeType) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        let unsortedSessions = [];

        sessions.forEach(group => {
            group.forEach(session => {
                unsortedSessions.push(session);
            })
        });

        let closestFilm = null;
        let closestDiff = Infinity;

        unsortedSessions.forEach(film => {
            const filmTime = timeToMinutes(film[timeType]);
            const diff = filmTime - currentMinutes;

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

    const getSessions = async () => {
        let sessions = null
        
        sessions = await fetchSessions();

        films.value = organizeSessions(await sessions, mode == 'cleared' ? 'end' : 'start')
    }

    onMounted(async () => {
        token.value = localStorage.getItem("authToken");
        
        if (!verifyToken(token.value)) {
            window.location.href = "/login";
        };

        await getSessions();

        setupWebSocket(getSessions);

        scrollToClosestFilm(films.value, mode == 'cleared' ? 'end' : 'start');

        setInterval(async () => {
            await getSessions();
        }, 30000);
    });

    onUnmounted(() => {
        cleanupWebSocket();
    });
</script>

<template>
    <div class="container">
        <div v-for="group in films" class="card-group">
            <Film v-for="film in group" :ref="filmRefs" :film="film" :mode="mode" />
        </div>
    </div>
</template>