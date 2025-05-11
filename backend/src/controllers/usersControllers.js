const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_KEY = process.env.JWT_KEY || "MamaHappy thank very ☺️";

exports.createUser = (req, res) => {
  const { username, password, role, email } = req.body;

  if (!username || !password || !role || !email) {
    return res.status(400).json({
      message: "All field are required username, password, role, email",
    });
  }

  if (role !== "owner" && role !== "employee") {
    return res
      .status(400)
      .json({ message: `Role must be owner or employee not ${role}` });
  }

  db.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
    (err, existUsers) => {
      if (err) {
        return res.status(500).json({
          message: "Some thing went wrong to get user but username or email",
          error: err.message,
        });
      }

      if (existUsers.length > 0) {
        return res.status(400).json({
          message:
            "Email or username is ready exit 😁😁, try other email or username",
        });
      }

      bcrypt
        .hash(password, 10)
        .then((hashPassword) => {
          db.query(
            "INSERT INTO users (username, email, password, role, isNew) VALUES (?, ?, ?, ?, ?)",
            [username, email, hashPassword, role, true],
            (insertError, insertResult) => {
              if (insertError) {
                return res.status(500).json({
                  message: "Some went wrong to insert user",
                  error: insertError.message,
                });
              }

              if (insertResult && insertResult.affectedRows === 1) {
                return res.status(201).json({
                  message: "Create user successful ☺️",
                  user: insertResult,
                });
              } else {
                return res.status(500).json({
                  message:
                    "Failed to create new account, unknown database issue during insert.",
                });
              }
            }
          );
        })
        .catch((hashErr) => {
          return res
            .status(500)
            .json({ message: "Can not hash password", error: hashErr.message });
        });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, users) => {
    if (err) {
      return res.status(500).json({
        message: "some thing went wrong to get user but email",
        error: err.message,
      });
    }

    if (users.length <= 0) {
      return res
        .status(401)
        .json({ message: `This email ${email} is not exit` });
    }

    const user = users[0];

    bcrypt.compare(password, user.password, (bcryptError, match) => {
      if (bcryptError) {
        return res.status(500).json({
          message: "Some thing went wrong comparing passwords",
          error: bcryptError.message,
        });
      }
      if (match) {
        const token = jwt.sign(
          {
            userId: user.userId,
            username: user.username,
            email: user.email,
            isNew: user.isNew,
            role: user.role,
          },
          JWT_KEY,
          { expiresIn: "20h" }
        );

        return res.status(200).json({
          message: "Login success full 🌼",
          token: token,
          userId: user.userId,
        });
      } else {
        return res.status(401).json({
          message:
            "Password are not match make, make sure your password are correct 🤔",
        });
      }
    });
  });
};

// CRUD Operations
exports.getAllUsers = (req, res) => {
  db.query("SELECT userId, username, email, role, createdAt FROM Users", (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching users",
        error: err.message,
      });
    }
    res.status(200).json(results);
  });
};

exports.getUserById = (req, res) => {
  const userId = req.params.id;
  
  db.query(
    "SELECT userId, username, email, role, createdAt FROM Users WHERE userId = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Error fetching user",
          error: err.message,
        });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(results[0]);
    }
  );
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { username, email, role } = req.body;
  
  if (!username || !email || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  db.query(
    "UPDATE Users SET username = ?, email = ?, role = ? WHERE userId = ?",
    [username, email, role, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Error updating user",
          error: err.message,
        });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully" });
    }
  );
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  
  db.query("DELETE FROM Users WHERE userId = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error deleting user",
        error: err.message,
      });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
};

exports.updatePassword = (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both passwords are required" });
  }
  
  // First get the user's current password
  db.query(
    "SELECT password FROM Users WHERE userId = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Error fetching user password",
          error: err.message,
        });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const user = results[0];
      
      // Verify current password
      bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({
            message: "Error comparing passwords",
            error: err.message,
          });
        }
        if (!isMatch) {
          return res.status(401).json({ message: "Current password is incorrect" });
        }
        
        // Hash and update new password
        bcrypt.hash(newPassword, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              message: "Error hashing new password",
              error: err.message,
            });
          }
          
          db.query(
            "UPDATE Users SET password = ?, isNew = ? WHERE userId = ?",
            [hash, false, userId],
            (err, updateResult) => {
              if (err) {
                return res.status(500).json({
                  message: "Error updating password",
                  error: err.message,
                });
              }
              res.status(200).json({ message: "Password updated successfully" });
            }
          );
        });
      });
    }
  );
};