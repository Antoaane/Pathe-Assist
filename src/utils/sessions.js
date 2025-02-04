import axios from 'axios';
import { saveLocalStorage, getLocalStorage, timeToMinutes } from '@/utils/tools';

const API_URL = import.meta.env.VITE_API_BASE;

export async function fetchSessions() {
    let token = getLocalStorage('authToken');

    let data = null;

    data = getLocalStorage('sessions');

    if (!data) {
        try {
            const response = await axios.get(`${API_URL}/sessions`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });

            data = response.data;

            saveLocalStorage('sessions', data, 11);
        } catch (error) {
            console.error("❌ Erreur lors de la récupération du JSON :", error);
        }
    }

    return data;
}

export function organizeSessions(sessions, param) {
    let organizedSessions = [];

    sessions.forEach((session) => {
        if (session.next) {
            session.danger = setDanger(param == 'end' ? session.next.start : session.start, session.play);
        } else {
            session.danger = 0;
        }
    })

    organizedSessions = groupSessions(sessions, param);

    return organizedSessions;
}

function groupSessions(films, sort) {
    const grouped = [];
    let currentGroup = [films[0]];

    for (let i = 1; i < films.length; i++) {
        const prevFilm = currentGroup[currentGroup.length - 1];
        const currentFilm = films[i];

        const prevEndTime = timeToMinutes(prevFilm[sort]);
        const currentEndTime = timeToMinutes(currentFilm[sort]);

        if (currentEndTime - prevEndTime <= 10) {
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

    return grouped;
};

function setDanger(startTime, playTime) {
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
