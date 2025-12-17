// Routes de gestion des utilisateurs (réservées aux administrateurs)
const express = require('express');
const isAuth = require('../middelwares/isAuth');
const hashRole = require('../middelwares/hashRole');
const upload = require('../utils/multer');
const {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

const router = express.Router();

// Les routes suivantes nécessitent d'être authentifié et d'avoir le rôle ADMIN
router.get('/', isAuth, hashRole('ADMIN'), listUsers);
router.get('/:id', isAuth, hashRole('ADMIN'), getUserById);
router.post('/', isAuth, hashRole('ADMIN'), upload.single('profilePic'), createUser);
router.put('/:id', isAuth, hashRole('ADMIN'), upload.single('profilePic'), updateUser);
router.delete('/:id', isAuth, hashRole('ADMIN'), deleteUser);

module.exports = router;
