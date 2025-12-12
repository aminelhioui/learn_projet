const { body } = require("express-validator");
exports.registerValidation = [
  body("userName")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters long"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{8,15}$/)
    .withMessage("Invalid phone number"),
  body("roleTitre").notEmpty().withMessage("Role is required"),
];
exports.loginValidation = [
     body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];