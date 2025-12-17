// Serveur principal Express
const express = require('express');
// Charge les variables d'environnement depuis le fichier .env
require('dotenv').config();
const app = express();

// Middleware utilitaires
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Configuration des origines autorisées pour CORS
// (modifiable via la variable d'environnement FRONTEND_URL)
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
];

// Configuration CORS personnalisée:
// - Autorise les requêtes provenant des origines listées
// - Autorise aussi les requêtes sans en-tête Origin (outils comme curl/postman)
app.use(cors({
    origin: (origin, callback) => {
        // Autoriser les outils non-navigateurs (pas d'en-tête Origin)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        if (/^http:\/\/localhost:517\d$/.test(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
}));

// Permet au serveur de parser le JSON dans le corps des requêtes
app.use(express.json());

// Sert les fichiers statiques du dossier uploads à l'URL /uploads
app.use("/uploads", express.static("uploads"));

// Parse les cookies des requêtes entrantes
app.use(cookieParser());

// Connexion à la base de données et seeding initial
const connectDB = require('./config/connectBD');
const seedRoles = require('./config/seed/seedRoles');
const seedAdmin = require('./config/seed/seedAdmin');

connectDB().then(async () => {
    try {
        // Crée les rôles par défaut si nécessaire
        await seedRoles();
        // Crée un administrateur par défaut si nécessaire
        await seedAdmin();
    } catch (error) {
        console.error("Erreur lors du seeding initial :", error.message)
    };
});


// Déclaration des routes de l'API
// Route d'authentification (login / register / refresh tokens...)
app.use('/api/auth', require("./routes/auth.route"));
// Routes liées aux utilisateurs (liste, création, suppression...)
app.use('/api/users', require("./routes/user.route"));


// Démarrage du serveur
const PORT = process.env.PORT || 4500;
app.listen(PORT, (err) => {
    err
    ?console.log(err)
    :console.log(`Server is running on http://localhost:${PORT}`);
});