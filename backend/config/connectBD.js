const mongoose = require('mongoose');





// Module de connexion à MongoDB via Mongoose
// Lit la variable d'environnement MONGO_URI et tente de se connecter.
// En cas d'erreur la fonction log l'erreur et termine le processus.
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI && process.env.MONGO_URI.trim();
        if (!mongoUri) {
            console.error('MongoDB connection failed: MONGO_URI is missing');
            process.exit(1);
        }

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 8000,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {   
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};
module.exports = connectDB;
