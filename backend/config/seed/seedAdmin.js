const bcrypt = require('bcrypt');
const User = require('../../models/User');
const Role = require('../../models/Role');

async function seedAdmin() {
    try {
        const adminRole = await Role.findOne({ titre: 'ADMIN' });
        if (!adminRole) {
            console.log('seedAdmin: rôle ADMIN non trouvé. Exécuter d\u00e9bord seedRoles.');
            return;
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
        const adminName = process.env.ADMIN_NAME || 'admin';
        const adminPhone = process.env.ADMIN_PHONE || '';

        const existing = await User.findOne({ email: adminEmail });
        if (existing) {
            console.log(`seedAdmin: utilisateur admin (${adminEmail}) déjà présent.`);
            return;
        }

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
        console.error('Erreur lors du seed admin :', error.message);
    }
}

module.exports = seedAdmin;
