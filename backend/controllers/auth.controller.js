// Contrôleur d'authentification : enregistre, connecte, déconnecte et renvoie l'utilisateur courant
// Utilise les modèles Role et User, bcrypt pour le hash des mots de passe,
// jwt pour la génération du token, et un utilitaire pour supprimer une image uploadée en cas d'erreur.
const Role = require("../models/Role");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const removeUploadimg = require("../utils/removeUploadimg");

// -------------Register------------
// Register : crée un nouvel utilisateur avec rôle et image optionnelle
// - Vérifie l'unicité de l'email
// - Valide et normalise le rôle fourni
// - Hash du mot de passe
// - Sauvegarde de l'utilisateur et renvoi d'une réponse sécurisée (sans password)
exports.register = async (req, res) => {
  try {
    const { userName, email, password, phone, roleTitre } = req.body;

    //image
    // Image de profil : si un fichier est uploadé, on construit son URL publique
    let profilePic = "https://avatar.iran.liara.run/public";
    if (req.file) {
      profilePic = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }
    //check email exist
    console.log(req.body);
    const existUser = await User.findOne({ email });
    if (existUser) {
        // Si l'email existe déjà, supprimer l'image uploadée (si présente) et renvoyer une erreur
        removeUploadimg(req.file);
      return res.status(400).json({
        success: false,
        error: [{ message: "Email already exists" }],
      });
    }
    // role existence + normalisation (ROLE stored uppercase)
    if (!roleTitre || typeof roleTitre !== "string") {
      // Role manquant ou invalide -> nettoyage et erreur
      removeUploadimg(req.file);
      return res.status(400).json({
        success: false,
        error: [{ message: "Role is required and must be a string" }],
      });
    }
    const normRoleTitre = roleTitre.trim().toUpperCase();
    const roleValide = await Role.findOne({ titre: normRoleTitre });
    if (!roleValide) {
        // Role non trouvé en base -> nettoyage et erreur
        removeUploadimg(req.file);
      return res.status(400).json({
        success: false,
        error: [{ message: "Role does not exist" }],
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      phone,
      profilePic,
      roles: roleValide._id,
    });
    // save
    await newUser.save();

    const safeUser = newUser.toObject();
    delete safeUser.password;
    //send response success
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (error) {
    removeUploadimg(req.file);
    // fail 500
    res.status(500).json({
      success: false,
      error: [{ message: "Server Error" }],
    });
  }
};
// ------------- Login ------------
// Vérifie les identifiants, génère un token JWT et place le cookie httpOnly
exports.login = async (req, res) => {
  try {
    // check email exist
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email }).populate("roles");
    if (!foundUser) {
      return res.status(400).json({
        success: false,
        error: [{ message: "Invalid email or password" }],
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: [{ message: "Invalid email or password" }],
      });
    }
    // store token
    // Génération du token JWT avec l'id utilisateur et le rôle
    const token = jwt.sign(
      { userId: foundUser._id, roles: foundUser.roles.titre },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    const cookieSameSite = process.env.NODE_ENV === "production" ? "none" : "lax";
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: cookieSameSite,
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });
    // update lastLogin timestamp for statistics
    try {
      foundUser.lastLogin = new Date();
      await foundUser.save();
    } catch (e) {
      console.error('Failed to update lastLogin:', e.message);
    }
    // response
    const safeUser = foundUser.toObject();
    delete safeUser.password;
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser,
      // token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: [{ message: "Server Error" }],
    });
  }
};
// --------------- Logout ------------
// Efface le cookie contenant le token côté client
exports.logout = (req, res) => {
  try {
    const cookieSameSite = process.env.NODE_ENV === "production" ? "none" : "lax";
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: cookieSameSite,
    });
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: [{ message: "Server Error" }],
    });
  }
};
// --------------- Current ------------
// Renvoie les informations de l'utilisateur courant (depuis req.user)
exports.current = async (req, res) => {
  try {
    // req user?
    const foundUser = await User.findById(req.user.id).populate("roles");
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        errors: [{ message: "User not found" }],
      });
    }
    const safeUser = foundUser.toObject();
    delete safeUser.password;
    return res.status(200).json({
        success: true,
      user: safeUser,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
        error: [{ message: "Server Error" }],
    });
    }
};
