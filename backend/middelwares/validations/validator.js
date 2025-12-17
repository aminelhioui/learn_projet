// Middleware qui centralise le résultat des validations express-validator
// Si des erreurs sont présentes :
// - Supprime le fichier uploadé (si présent)
// - Renvoie les erreurs formatées au client
const { validationResult } = require("express-validator");
const removeUploadimg = require("../../utils/removeUploadimg");

module.exports = (req, res, next) => {
    const errors = validationResult(req);

  if (!errors.isEmpty()) {
    if (req.file) {
      removeUploadimg(req.file);
    }
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};