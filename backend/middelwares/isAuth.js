const jwt = require("jsonwebtoken");
const isAuth = async (req, res, next) => {
  try {
//verification de config
if(!process.env.JWT_SECRET){
  return res.status(500).json({
    success: false, 
    errors: [{ message: "JWT_SECRET missed" }],
  });
}
//recuperer token
const token = req.cookies.token;
if (!token) {
  return res.status(401).json({
    success: false,
    errors: [{ message: "No token, authorization denied" }],
  });
}
//decode
let decoded = jwt.verify(token, process.env.JWT_SECRET);
// est ce que le user existe
const foundUser = await User.findById(decoded.userId).populate("role");
if (!foundUser) {
  return res.status(404).json({
    success: false,
    errors: [{ message: "User not found, authorization denied" }],
  });
}
req.user = { id: foundUser._id, role: foundUser.role.titre };
next();
  } catch (error) {
    return res.status(500).json({
      success: false,
        errors: [{ message: "Server Error" }],
  });
  }
};

module.exports = isAuth; 
