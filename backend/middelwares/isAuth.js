// Middleware d'authentification : vérifie la présence et la validité du cookie JWT
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuth = async (req, res, next) => {
  try {
// Vérification que la clé secrète JWT est définie
if(!process.env.JWT_SECRET){
  return res.status(500).json({
    success: false, 
    errors: [{ message: "JWT_SECRET missed" }],
  });
}
// Récupère le token dans les cookies
const token = req.cookies.token;
if (!token) {
  return res.status(401).json({
    success: false,
    errors: [{ message: "No token, authorization denied" }],
  });
}
// Décode et vérifie le token
let decoded = jwt.verify(token, process.env.JWT_SECRET);
// Vérifie que l'utilisateur existe en base et récupère son rôle
const foundUser = await User.findById(decoded.userId).populate("roles");
if (!foundUser) {
  return res.status(404).json({
    success: false,
    errors: [{ message: "User not found, authorization denied" }],
  });
}
// Ajoute un objet `req.user` minimal pour les middlewares/routes suivants
req.user = { id: foundUser._id, role: foundUser.roles.titre };
next();
  } catch (error) {
    return res.status(500).json({
      success: false,
        errors: [{ message: "Server Error" }],
  });
  }
};

module.exports = isAuth; 
