const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token." });
    }
    req.userId = decoded.userId;
    next();
  });
};

// A <video>/<source> tag nem tud egyedi Authorization headert küldeni, ezért ezt a
// változatot a videó-kiszolgáló route használja: a tokent header helyett (vagy mellett)
// query paraméterből is elfogadja.
exports.verifyTokenFromHeaderOrQuery = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1] || req.query.token;
  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token." });
    }
    req.userId = decoded.userId;
    next();
  });
};

exports.verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user || user.rang !== "a") {
      return res.status(403).json({ error: "Access denied." });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};
