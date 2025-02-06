const WS_URL = import.meta.env.VITE_WS_URL;

let socket = null;

export function setupWebSocket(actionToTrigger) {
    socket = new WebSocket(WS_URL); 

    // Quand le WebSocket est ouvert
    socket.onopen = () => {
        console.log('Connexion WebSocket établie.');
    };

    // Quand un message est reçu
    socket.onmessage = (event) => {
        console.log("y'a un changement l'équipe :", event);
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
