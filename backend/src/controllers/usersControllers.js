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
