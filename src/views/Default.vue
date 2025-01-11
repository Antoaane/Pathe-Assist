<script setup>
// import films from '@/components/format.json'
import { ref, onMounted, computed  } from 'vue';
import Film from '@/components/Film.vue'

const films = ref([
    {
        "name": "Le Seigneur des Anneaux: La Guerre des Rohirrim",
        "room": "11",
        "ban": null,
        "start": "11:40",
        "play": "17:05",
        "end": "11:40"
    },
    {
        "name": "Vaiana 2",
        "room": "9",
        "ban": null,
        "start": "11:40",
        "play": "17:50",
        "end": "11:40"
    },
    {
        "name": "Jamais sans mon psy",
        "room": "3",
        "ban": null,
        "start": "11:20",
        "play": "18:10",
        "end": "11:20"
    },
    {
        "name": "Vaiana 2",
        "room": "10",
        "ban": null,
        "start": "11:33",
        "play": "18:50",
        "end": "11:33"
    },
    {
        "name": "Les Femmes au balcon",
        "room": "16",
        "ban": null,
        "start": "19:00",
        "play": "19:20",
        "end": "21:03"
    },
    {
        "name": "Vaiana 2",
        "room": "4DX",
        "ban": null,
        "start": "19:15",
        "play": "19:35",
        "end": "21:14"
    },
    {
        "name": "Vaiana 2",
        "room": "1",
        "ban": null,
        "start": "19:20",
        "play": "19:40",
        "end": "21:19"
    },
    {
        "name": "Saint-Ex",
        "room": "6",
        "ban": null,
        "start": "19:30",
        "play": "19:50",
        "end": "21:28"
    },
    {
        "name": "JURE N°2",
        "room": "12",
        "ban": null,
        "start": "19:20",
        "play": "19:35",
        "end": "21:29"
    },
    {
        "name": "Wicked",
        "room": "IMAX",
        "ban": null,
        "start": "18:30",
        "play": "18:50",
        "end": "21:31"
    },
    {
        "name": "Venom: The Last Dance",
        "room": "5",
        "ban": null,
        "start": "19:30",
        "play": "19:50",
        "end": "21:39"
    },
    {
        "name": "En fanfare",
        "room": "8",
        "ban": null,
        "start": "19:45",
        "play": "20:05",
        "end": "21:48"
    },
    {
        "name": "Conclave",
        "room": "7",
        "ban": null,
        "start": "19:30",
        "play": "19:50",
        "end": "21:50"
    },
    {
        "name": "Jamais sans mon pay",
        "room": "3",
        "ban": null,
        "start": "20:00",
        "play": "20:20",
        "end": "21:51"
    },
    {
        "name": "Leurs Enfants après eux",
        "room": "4",
        "ban": null,
        "start": "19:15",
        "play": "19:35",
        "end": "21:56"
    },
    {
        "name": "Le Seigneur des Anneaux: La Guerre des Rohimm",
        "room": "9",
        "ban": "-12",
        "start": "19:45",
        "play": "20:00",
        "end": "22:14"
    },
    {
        "name": "Gladiator II",
        "room": "14",
        "ban": null,
        "start": "19:30",
        "play": "19:45",
        "end": "22:15"
    },
    {
        "name": "L'Amour ouf",
        "room": "15",
        "ban": null,
        "start": "19:15",
        "play": "19:35",
        "end": "22:15"
    },
    {
        "name": "Vaiana 2",
        "room": "10",
        "ban": null,
        "start": "20:45",
        "play": "21:05",
        "end": "22:44"
    },
    {
        "name": "Wicked",
        "room": "11",
        "ban": null,
        "start": "20:00",
        "play": "20:20",
        "end": "23:01"
    },
    {
        "name": "Vaiana 2",
        "room": "1",
        "ban": null,
        "start": "21:45",
        "play": "22:05",
        "end": "23:44"
    },
    {
        "name": "Le Seigneur des Anneaux: La Guerre des Rohirrin",
        "room": "4DX",
        "ban": null,
        "start": "21:30",
        "play": "21:50",
        "end": "00:04"
    },
    {
        "name": "Wicked",
        "room": "16",
        "ban": null,
        "start": "21:15",
        "play": "21:35",
        "end": "00:16"
    },
    {
        "name": "Les Femmes au balcon",
        "room": "7",
        "ban": "-12",
        "start": "22:15",
        "play": "22:35",
        "end": "00:18"
    },
    {
        "name": "Venom: The Last Dance",
        "room": "4",
        "ban": null,
        "start": "22:10",
        "play": "22:30",
        "end": "00:19"
    },
    {
        "name": "Le Seigneur des Anneaux: La Guerre des Rohirrim",
        "room": "6",
        "ban": null,
        "start": "21:45",
        "play": "22:05",
        "end": "00:19"
    },
    {
        "name": "Saint-Ex",
        "room": "14",
        "ban": null,
        "start": "22:30",
        "play": "22:50",
        "end": "00:28"
    },
    {
        "name": "Vaiana 2",
        "room": "15",
        "ban": null,
        "start": "22:30",
        "play": "22:50",
        "end": "00:29"
    }
]);

const groupedFilms = ref([]);

const timeToMinutes = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;

    if (hours < 6) {
        totalMinutes += 1440;
    }

    return totalMinutes;
};

function groupFilms(films, sort = 'end') {
    const sortedFilms = [...films.value].sort((a, b) => timeToMinutes(a[sort]) - timeToMinutes(b[sort]));

    const grouped = [];
    let currentGroup = [sortedFilms[0]];

    for (let i = 1; i < sortedFilms.length; i++) {
        const prevFilm = currentGroup[currentGroup.length - 1];
        const currentFilm = sortedFilms[i];

        const prevEndTime = timeToMinutes(prevFilm[sort]);
        const currentEndTime = timeToMinutes(currentFilm[sort]);

        if (currentEndTime - prevEndTime <= 20) {
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

function getIntensity(startTime, index) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = timeToMinutes(startTime);
    const minBeforeStart = 15;
    let red = 0

    if (currentMinutes >= startMinutes) {
        red = 255;
    }

    const progress = (currentMinutes - (startMinutes - minBeforeStart)) / minBeforeStart;
    red = Math.round(progress * 255);

    films.value[index].danger = red;
};

onMounted(() => {
    films.value.map((film, index) => ({
        ...film,
        intensity: getIntensity(film.start, index)
    }));

    groupFilms(films);

    setInterval(() => {
        films.value.forEach((film, index) => {
            getIntensity(film.start, index)
        });
        groupFilms(films);
    }, 5000);
});
</script>

<template>
    <div class="container">
        <div v-for="group in groupedFilms" class="card-group">
            <Film v-for="film in group" :film="film"/>
        </div>
    </div>
</template>