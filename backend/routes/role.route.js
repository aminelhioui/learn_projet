const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// GET /api/roles - renvoie la liste des rôles disponibles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find({}).select('titre -_id');
    return res.status(200).json({ roles });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

module.exports = router;
