import { timeToMinutes } from '@/utils/sessionsOrder'

export function setDanger(startTime, playTime) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = timeToMinutes(startTime);
    const playMinutes = timeToMinutes(playTime);
    const minBeforeStart = 15;
    const minAfterStart = 20;
    let red = 0;

    const progress = (currentMinutes - (startMinutes - minBeforeStart)) / minBeforeStart;
    red = Math.round(progress * 255);

    if (currentMinutes >= startMinutes) {
        if (currentMinutes >= (playMinutes + minAfterStart)) { // film commencé depuis "minAfterStart" minutes
            red = 257;
        } else if (currentMinutes >= (playMinutes)) { // film commencé
            red = 256;
        } else {
            red = 255; // film non-commencé
        }
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

let socket = null;

export function setupWebSocket(actionToTrigger) {
    socket = new WebSocket('ws://localhost:5000'); 

    // Quand le WebSocket est ouvert
    socket.onopen = () => {
        console.log('Connexion WebSocket établie.');
    };

    // Quand un message est reçu
    socket.onmessage = (event) => {
        actionToTrigger();
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

export function cleanupWebSocket() {
    if (socket) {
        socket.close(); // Fermer la connexion
        console.log('Connexion WebSocket nettoyée.');
    }
}