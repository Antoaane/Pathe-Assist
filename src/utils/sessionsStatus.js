import { timeToMinutes } from '@/utils/sessionsOrder'

export function setDanger(startTime) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = timeToMinutes(startTime);
    const minBeforeStart = 15;
    let red = 0;

    const progress = (currentMinutes - (startMinutes - minBeforeStart)) / minBeforeStart;
    red = Math.round(progress * 255);

    if (currentMinutes >= startMinutes) {
        red = 255;
    }

    return red;
}

export function scrollToClosestFilm(sessions, timeType) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let closestFilm = null;
    let closestDiff = Infinity;

    sessions.forEach(film => {
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