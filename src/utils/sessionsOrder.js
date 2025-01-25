export function timeToMinutes(time) {
    let [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;

    if (hours < 6) {
        totalMinutes += 1440;
    }

    return totalMinutes;
};

export function groupSessions(films, sort = 'end') {

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

    // Ajouter la séance suivante la plus proche dans la même salle pour chaque film
    for (const group of grouped) {
        for (const film of group) {
            const currentEndTime = timeToMinutes(film[sort]);

            // Trouver la séance suivante la plus proche dans la même salle
            const nextSession = films.find(
                (f) => f.room === film.room && timeToMinutes(f.start) > currentEndTime
            );

            // Ajouter la séance suivante trouvée ou null si aucune n'existe
            film.nextSession = nextSession ? nextSession.start : null;
        }
    }

    console.log(grouped);

    return grouped;
};