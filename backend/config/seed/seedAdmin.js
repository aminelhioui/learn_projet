// Script de seed pour créer un utilisateur administrateur par défaut
// Lit les variables d'environnement ADMIN_* pour configurer l'utilisateur
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const Role = require('../../models/Role');

async function seedAdmin() {
    try {
        // Récupère le rôle ADMIN déjà inséré par seedRoles
        const adminRole = await Role.findOne({ titre: 'ADMIN' });
        if (!adminRole) {
            console.log('seedAdmin: rôle ADMIN non trouvé. Exécuter d\u00e9bord seedRoles.');
            return;
        }

        // Valeurs par défaut ou provenant des variables d'environnement
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
        const adminName = process.env.ADMIN_NAME || 'admin';
        const adminPhone = process.env.ADMIN_PHONE || '';

        // Vérifie si un admin avec ce mail existe déjà
        const existing = await User.findOne({ email: adminEmail });
        if (existing) {
            console.log(`seedAdmin: utilisateur admin (${adminEmail}) déjà présent.`);
            return;
        }

        // Hash du mot de passe avant sauvegarde
        const hashed = await bcrypt.hash(adminPassword, 10);

        const adminUser = new User({
            userName: adminName,
            email: adminEmail,
            password: hashed,
            phone: adminPhone,
            roles: adminRole._id,
        });

        await adminUser.save();
        console.log(`seedAdmin: utilisateur admin créé (email: ${adminEmail})`);
    } catch (error) {
        // Log en cas d'erreur lors du seed
        console.error('Erreur lors du seed admin :', error.message);
    }
}

module.exports = seedAdmin;
