const Role = require("../models/Role");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const removeUploadimg = require("../utils/removeUploadimg");

// -------------Register------------
exports.register = async (req, res) => {
  try {
    const { userName, email, password, phone, roleTitre } = req.body;

    //image
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
        // 
        removeUploadimg(req.file);
      return res.status(400).json({
        success: false,
        error: [{ message: "Email already exists" }],
      });
    }
    //role exist+normalisastion
    if (!roleTitre || typeof roleTitre !== "string") {
        removeUploadimg(req.file);
      return res.status(400).json({
        success: false,
        error: [{ message: "Role is required and must be a string" }],
      });
    }
    const normRoleTitre = roleTitre.trim().toLowerCase();
    const roleValide = await Role.findOne({ titre: normRoleTitre });
    if (!roleValide) {
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
    //send response success
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
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
// -------------Login------------
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
    const token = jwt.sign(
      { userId: foundUser._id, roles: foundUser.roles.titre },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });
    // response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: foundUser,
      // token,
    });
  } catch (error) {}
  // fail 500
  res.status(500).json({
    success: false,
    error: [{ message: "Server Error" }],
  });
};
// ---------------logout------------
exports.logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: [{ message: "Server Error" }],
    });
  }

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
// ---------------Current------------
exports.current = async (req, res) => {
  try {
    // req user?
    const foundUser = await User.findById(req.user.id).populate("role");   
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        errors: [{ message: "User not found" }],
      });
    }
    return res.status(200).json({
        success: true,
        user: foundUser,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
        error: [{ message: "Server Error" }],
    });
    }
};
