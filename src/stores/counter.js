import { reactive } from 'vue';

export const sessions = reactive({
  sessions: [], // La variable que tu veux rendre réactive
});

// Fonction pour mettre à jour la variable
export const updateSessions = (sessions) => {
  sessions.sessions = sessions;
};
