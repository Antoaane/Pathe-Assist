<script setup>
// import films from '@/components/format.json'
import { ref, onMounted, computed  } from 'vue';

const films = ref([
    {
        "name": "Le Seigneur des Anneaux: La Guerre des Rohirrim",
        "room": "11",
        "ban": null,
        "start": "16:45",
        "play": "17:05",
        "end": "19:19"
    },
    {
        "name": "Vaiana 2",
        "room": "9",
        "ban": null,
        "start": "17:30",
        "play": "17:50",
        "end": "19:29"
    },
    {
        "name": "Jamais sans mon psy",
        "room": "3",
        "ban": null,
        "start": "17:50",
        "play": "18:10",
        "end": "19:41"
    },
    {
        "name": "Vaiana 2",
        "room": "10",
        "ban": null,
        "start": "18:30",
        "play": "18:50",
        "end": "20:29"
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

// Convertir "HH:MM" en minutes pour comparaison, en gérant les horaires après minuit
const timeToMinutes = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;

    // Si l'heure est après minuit (00h - 05h), on ajoute 24h (1440 minutes) pour la placer correctement après les heures du soir
    if (hours < 6) {
        totalMinutes += 1440;
    }

    return totalMinutes;
};

// Fonction de regroupement
function groupFilms(films, sort = 'end') {
    // Trier les films par heure de fin avec gestion des heures après minuit
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

    // Trier les groupes en fonction de l'heure de fin du premier film de chaque groupe
    grouped.sort((a, b) => timeToMinutes(a[0][sort]) - timeToMinutes(b[0][sort]));

    groupedFilms.value = grouped;
};

function getIntensity(startTime, index) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = timeToMinutes(startTime);
    const minBeforeStart = 15;

    if (currentMinutes >= startMinutes) {
        return 255; // Si l'heure actuelle est après ou égale à l'heure de début → 255
    }
    if (currentMinutes <= startMinutes - minBeforeStart) {
        return 0; // Si on est encore plus de 15 min avant → 0
    }

    // Calcul linéaire entre 0 et 255
    const progress = (currentMinutes - (startMinutes - minBeforeStart)) / minBeforeStart;
    const red = Math.round(progress * 255);

    films.value[index].danger = red;
};

// Valeur réactive pour les intensités de chaque film
const filmIntensities = computed(() => {
    return films.value.map(film => ({
        ...film,
        intensity: getIntensity(film.start)
    }));
});

// Rafraîchir les valeurs toutes les 30 secondes
onMounted(() => {
    groupFilms(films);

    setInterval(() => {
        films.value.map((film, index) => ({
            ...film,
            intensity: getIntensity(film.start, index)
        }));
        groupFilms(films);
        console.log(films);
    }, 5000);
});
</script>

<template>
    <div class="container">
        <div v-for="group in groupedFilms" class="card-group">
            <div 
                v-for="film in group" 
                class="card-component" 
                :style="{ background : `linear-gradient(92deg, rgba(255, ${255 - film.danger}, ${255 - film.danger}, 0.35) -1.9%, rgba(255, 255, 255, 0.23) 98.59%)` }">
                <div class="top">
                    <p class="film-title">
                        {{ film.name }}
                    </p>
                    <p class="ban">
                        {{ film.ban }}
                    </p>
                </div>
                <div class="main">
                    <p class="room">
                        {{ film.room }}
                    </p>
                    <div class="line"></div>
                    <div class="houre">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 5.5L0.666668 3.37234L1.48333 2.62766L3 4.01064L6.85 0.5L7.66667 1.24468L3 5.5Z" fill="white"/>
                        </svg>
                        <p>
                            {{ film.start }}
                        </p>
                    </div>
                    <div class="houre">
                        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.58124 8.87054C0.91937 9.34331 0 8.87018 0 8.05681V1.94319C0 1.12982 0.91937 0.656693 1.58124 1.12946L5.86077 4.18627C6.41912 4.58509 6.41912 5.41491 5.86077 5.81373L1.58124 8.87054Z" fill="white"/>
                        </svg>
                        <p>
                            {{ film.play }}
                        </p>
                    </div>
                    <div class="houre">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.1111 7.5C0.89721 7.5 0.714108 7.42384 0.561793 7.27153C0.409478 7.11921 0.333321 6.93611 0.333321 6.72222V1.27778C0.333321 1.06389 0.409478 0.880787 0.561793 0.728472C0.714108 0.576157 0.89721 0.5 1.1111 0.5H6.55554C6.76943 0.5 6.95253 0.576157 7.10485 0.728472C7.25716 0.880787 7.33332 1.06389 7.33332 1.27778V6.72222C7.33332 6.93611 7.25716 7.11921 7.10485 7.27153C6.95253 7.42384 6.76943 7.5 6.55554 7.5H1.1111Z" fill="white"/>
                        </svg>
                        <p>
                            {{ film.end }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>