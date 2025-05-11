const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_KEY = process.env.JWT_KEY || "MamaHappy thank very ☺️";

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication failed - no token provided" });
    }
    
    const decoded = jwt.verify(token, JWT_KEY);
    req.user = decoded;
    
    // Optional: Verify user still exists in database
    db.query(
      "SELECT userId FROM Users WHERE userId = ?",
      [decoded.userId],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Error verifying user",
            error: err.message,
          });
        }
        if (results.length === 0) {
          return res.status(401).json({ message: "User no longer exists" });
        }
        next();
      }
    );
  } catch (err) {
    return res.status(401).json({ 
      message: "Authentication failed - invalid token",
      error: err.message 
    });
  }
};