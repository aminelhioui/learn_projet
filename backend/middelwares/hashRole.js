// Middleware pour restreindre l'accès selon le rôle
// Usage: hashRole('ADMIN', 'MOD') -> ne laisse passer que les utilisateurs ayant l'un de ces rôles
const hashRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            // Pas d'utilisateur authentifié dans la requête
            return res.status(401).json({
                success: false,
                errors: [{ message: "Unauthorized: No user information found" }],
            });
        }
        // Vérifie si le rôle de l'utilisateur est dans la liste des rôles autorisés
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                errors: [{ message: "Forbidden: You do not have access to this resource" }],
            });
        }
        next();
    };
};

module.exports = hashRole;