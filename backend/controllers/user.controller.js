// Contrôleur utilisateurs : listage, récupération, création, mise à jour et suppression
// Utilise bcrypt pour le hash des mots de passe et le modèle Role pour la validation des rôles
const bcrypt = require('bcrypt');
const Role = require('../models/Role');
const User = require('../models/User');

// Normalise le titre du rôle (trim + uppercase) ou retourne null si invalide
const normalizeRoleTitre = (roleTitre) => {
  if (!roleTitre || typeof roleTitre !== 'string') return null;
  return roleTitre.trim().toUpperCase();
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('roles')
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [{ message: 'Server Error' }],
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('roles')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        errors: [{ message: 'User not found' }],
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [{ message: 'Server Error' }],
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { userName, email, password, phone, roleTitre } = req.body;

    if (!userName || !email || !password || !roleTitre) {
      return res.status(400).json({
        success: false,
        errors: [{ message: 'userName, email, password and roleTitre are required' }],
      });
    }

    const normRoleTitre = normalizeRoleTitre(roleTitre);
    const role = await Role.findOne({ titre: normRoleTitre });
    if (!role) {
      return res.status(400).json({
        success: false,
        errors: [{ message: 'Role does not exist' }],
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        errors: [{ message: 'Email already exists' }],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePic = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined;

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      phone,
      roles: role._id,
      ...(profilePic ? { profilePic } : {}),
    });

    await newUser.save();

    const created = await User.findById(newUser._id)
      .populate('roles')
      .select('-password');

    return res.status(201).json({
      success: true,
      message: 'User created',
      user: created,
    });
  } catch (error) {
    // If file was uploaded but error occurred, remove the uploaded file
    if (req.file) {
      const removeUploadimg = require('../utils/removeUploadimg');
      removeUploadimg(req.file);
    }
    if (error?.code === 11000) {
      return res.status(400).json({
        success: false,
        errors: [{ message: 'Duplicate field value' }],
      });
    }

    return res.status(500).json({
      success: false,
      errors: [{ message: 'Server Error' }],
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userName, email, phone, roleTitre, password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        errors: [{ message: 'User not found' }],
      });
    }

    if (typeof userName === 'string') user.userName = userName;
    if (typeof email === 'string') user.email = email;
    if (typeof phone === 'string') user.phone = phone;

    if (typeof password === 'string' && password.trim().length > 0) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (roleTitre !== undefined) {
      const normRoleTitre = normalizeRoleTitre(roleTitre);
      const role = await Role.findOne({ titre: normRoleTitre });
      if (!role) {
        return res.status(400).json({
          success: false,
          errors: [{ message: 'Role does not exist' }],
        });
      }
      user.roles = role._id;
    }

    // handle uploaded profile picture
    if (req.file) {
      const removeUploadimg = require('../utils/removeUploadimg');
      // remove previous file if it exists
      if (user.profilePic) removeUploadimg(user.profilePic);
      user.profilePic = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await user.save();

    const updated = await User.findById(user._id)
      .populate('roles')
      .select('-password');

    return res.status(200).json({
      success: true,
      message: 'User updated',
      user: updated,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        success: false,
        errors: [{ message: 'Duplicate field value' }],
      });
    }

    return res.status(500).json({
      success: false,
      errors: [{ message: 'Server Error' }],
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        errors: [{ message: 'User not found' }],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [{ message: 'Server Error' }],
    });
  }
};
