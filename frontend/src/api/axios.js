import axios from 'axios';

// URL de base du backend (modifiable selon l'environnement)
export const BACKEND_BASE_URL = 'http://localhost:4500';

// Instance axios configurée pour l'API:
// - baseURL: préfixe `/api` pour toutes les requêtes
// - withCredentials: envoie les cookies (utile pour l'authentification via cookie httpOnly)
const api = axios.create({
  baseURL: `${BACKEND_BASE_URL}/api`,
  withCredentials: true,
});

export default api;
