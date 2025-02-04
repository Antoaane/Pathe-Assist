export function saveLocalStorage(name, content, hours) {
    const now = new Date();
    const expiry = now.getTime() + hours * 60 * 60 * 1000; // Convertit minutes en millisecondes

    const data = {
        [name]: content,
        expiry: expiry,
    };

    localStorage.setItem(name, JSON.stringify(data));
};

export function getLocalStorage(name) {
    const data = localStorage.getItem(name);

    if (!data) return null; 

    const parsedData = JSON.parse(data);
    const now = new Date().getTime();

    if (now > parsedData.expiry) {
        localStorage.removeItem(name);
        return null;
    }

    return parsedData[name]; 
};

export function timeToMinutes(time) {
    let [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;

    if (hours < 6) {
        totalMinutes += 1440;
    }

    return totalMinutes;
};
