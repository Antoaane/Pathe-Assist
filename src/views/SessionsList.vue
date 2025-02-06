<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import { timeToMinutes, getLocalStorage  } from '@/utils/tools';
    import { fetchSessions, organizeSessions } from '@/utils/sessions';
    import { setupWebSocket, cleanupWebSocket } from '@/utils/webSocket';
    import { verifyToken } from '@/utils/login'
    import Film from '@/components/Film.vue'

    const props = defineProps({
        mode: String
    })

    const mode = props.mode;
    let intervalId = null;
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

    const getSessions = async (force = false) => {
        let sessions = null
        
        sessions = await fetchSessions(force);

        films.value = organizeSessions(await sessions, mode == 'cleared' ? 'end' : 'start');

        console.log('getSessions :', films.value);
    }

    onMounted(async () => {        
        if (!verifyToken(await getLocalStorage('authToken'))) {
            window.location.href = "/login";
        };

        await getSessions();

        setupWebSocket(() => getSessions(true));

        scrollToClosestFilm(films.value, mode == 'cleared' ? 'end' : 'start');

        intervalId = setInterval(async () => {
            await getSessions();
        }, 10000);
    });

    onUnmounted(() => {
        cleanupWebSocket();
        if (intervalId) {
            clearInterval(intervalId);
        }
    });
</script>

<template>
    <div class="container">
        <div v-for="group in films" class="card-group">
            <Film v-for="film in group" :ref="filmRefs" :film="film" :mode="mode" />
        </div>
    </div>
</template>