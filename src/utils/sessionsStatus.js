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