// Schéma Mongoose pour les utilisateurs
// Champs importants : userName, email (unique), password (hashé), rôle (référence vers Role)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim : true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim : true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim : true,
    },
    phone: String,
    profilePic: {
        type: String,
        default: "https://avatar.iran.liara.run/public",
    },
    roles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    // Date de dernière connexion et compteur d'actions effectuées
    lastLogin: Date,
    actionCount: {
        type: Number,
        default: 0,
    },
    // Historique léger des timestamps d'actions (utilisé pour calculer "actions cette semaine")
    actionTimestamps: {
        type: [Date],
        default: [],
    },
}, 
{timestamps: true, versionKey: false}
);

const User = mongoose.model('User', userSchema);
module.exports = User;
