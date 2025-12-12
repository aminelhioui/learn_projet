const Role = require('../../models/Role');
async function seedRoles() {
    try {
        const count = await Role.countDocuments();
        if (count >0) {
            console.log("Roles are already seeded");
            return;
        }
        await Role.insertMany([
            { titre: "ADMIN", permissions: [] },
            { titre: "RECRUT", permissions: [] },
            { titre: "CONSULTANT", permissions: [] },
  
        ]);
        console.log("Roles par défaut créés avec succès");

    } catch (error) {
        console.error("Erreur lors du seeding des rôles :", error.message);
    }
}
module.exports = seedRoles;