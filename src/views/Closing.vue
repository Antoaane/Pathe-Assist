<script setup>
// import films from '@/components/format.json'
import { ref, onMounted, computed  } from 'vue';
import Film from '@/components/Film.vue'

const films = ref([]);
const groupedFilms = ref([]);

const timeToMinutes = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;

    if (hours < 6) {
        totalMinutes += 1440;
    }

    return totalMinutes;
};

function groupFilms(films, sort = 'play') {
    const sortedFilms = [...films.value].sort((a, b) => timeToMinutes(a[sort]) - timeToMinutes(b[sort]));

    const grouped = [];
    let currentGroup = [sortedFilms[0]];

    for (let i = 1; i < sortedFilms.length; i++) {
        const prevFilm = currentGroup[currentGroup.length - 1];
        const currentFilm = sortedFilms[i];

        const prevEndTime = timeToMinutes(prevFilm[sort]);
        const currentEndTime = timeToMinutes(currentFilm[sort]);

        if (currentEndTime - prevEndTime <= 30) {
            currentGroup.push(currentFilm);
        } else {
            grouped.push(currentGroup);
            currentGroup = [currentFilm];
        }
    }

    if (currentGroup.length > 0) {
        grouped.push(currentGroup);
    }

    grouped.sort((a, b) => timeToMinutes(a[0][sort]) - timeToMinutes(b[0][sort]));

    groupedFilms.value = grouped;
};

function getIntensity(startTime, filmTime, endTime, index) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = timeToMinutes(startTime);
    const playMinutes = timeToMinutes(filmTime);
    const endMinutes = timeToMinutes(endTime);
    const minBeforeStart = 15;
    let red = 0

    const progress = (currentMinutes - (startMinutes - minBeforeStart)) / minBeforeStart;
    red = Math.round(progress * 255);

    if (currentMinutes >= startMinutes) {
        if (currentMinutes >= (playMinutes + 20)) {
            red = 257;
        } else if (currentMinutes >= (playMinutes)) {
            red = 256;
        } else {
            red = 255;
        }
    }

    films.value[index].danger = red;
    films.value[index].id = index;

    let closestFilmIndex = null;
    let closestDiff = Infinity;

    films.value.forEach((film, i) => {
        const filmPlayTime = timeToMinutes(film.play) + 30;
        const diff = filmPlayTime - currentMinutes;

        if (diff >= 0 && diff < closestDiff) {
            closestDiff = diff;
            closestFilmIndex = i;
        }
    });

    // Appliquer "closest = true" uniquement au film le plus proche, et "false" aux autres
    films.value.forEach((film, i) => {
        film.closestPlay = (i === closestFilmIndex);
    });
};

async function fetchData() {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/Antoaane/Pathe-Pattern/main/pattern.json`);
        if (!response.ok) throw new Error('Erreur lors du chargement du JSON');
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du JSON :", error);
    }
}

async function actualiseData() {
    films.value = await fetchData();

    console.log(films.value);

    films.value.map((film, index) => ({
        ...film,
        intensity: getIntensity(film.start, film.play, film.end, index)
    }));

    groupFilms(films);

    setInterval(() => {
        console.log(films.value);
        films.value.forEach((film, index) => {
            getIntensity(film.start, film.play, film.end, index)
        });
        groupFilms(films);
    }, 5000);
}

onMounted(() => {
    actualiseData()
});
</script>

<template>
    <div class="container">
        <div v-for="group in groupedFilms" class="card-group">
            <Film v-for="film in group" :film="film" mode="closing"/>
        </div>
    </div>
</template>
