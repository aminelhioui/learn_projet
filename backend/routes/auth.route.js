// Routes d'authentification
// - /register : création d'un compte (upload image possible)
// - /login : authentification et création du cookie JWT
// - /logout : efface le cookie
// - /current : récupère l'utilisateur courant (requiert authentification)
const express = require('express');
const { register, login, logout, current } = require('../controllers/auth.controller');
const upload = require('../utils/multer');
const { registerValidation, loginValidation} = require('../middelwares/validations/authValidation');
const validate = require('../middelwares/validations/validator');
const isAuth = require('../middelwares/isAuth');
const hashRole = require('../middelwares/hashRole');

// route de test simple
const router = express.Router();
router.get('/test', (req, res) => {
    res.send('auth route');
});

// register (ouvert pour les nouveaux utilisateurs)
// Utilise `upload.single('profilePic')` pour accepter une image optionnelle
router.post('/register', upload.single('profilePic'), registerValidation, validate, register);
// Login
router.post('/login' ,loginValidation, validate ,login ) ;
// logout
router.post('/logout' , logout ) ;
// current user (nécessite le middleware d'authentification)
router.get('/current', isAuth, current );


module.exports = router;

