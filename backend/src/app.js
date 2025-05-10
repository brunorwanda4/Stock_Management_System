const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/usersRoutes");
const app = express();

app.use(cors());
app.use(bodyParser.json());

require("./config/db");

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to my youtube channel 😁😁" });
});

app.use("/users", userRoutes);

app.listen(3008, () =>
  console.log("Backend is running on port http://localhost:3008  🌼")
);
