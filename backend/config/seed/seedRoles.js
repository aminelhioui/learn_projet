// Script de seed pour insérer les rôles par défaut en base
// Utilisé au démarrage pour s'assurer que les rôles existent
const Role = require('../../models/Role');
async function seedRoles() {
    try {
        const count = await Role.countDocuments();
        if (count >0) {
            // Si des rôles existent déjà, on ne ré-initialise pas
            console.log("Roles are already seeded");
            return;
        }
        await Role.insertMany([
            { titre: "ADMIN", permissions: [] },
            { titre: "RECRUT", permissions: [] },
            { titre: "CONSULTANT", permissions: [] },
  
        ]);
        // Insertion des rôles par défaut
        console.log("Roles par défaut créés avec succès");

    } catch (error) {
        // Log en cas d'erreur lors du seed
        console.error("Erreur lors du seeding des rôles :", error.message);
    }
}
module.exports = seedRoles;