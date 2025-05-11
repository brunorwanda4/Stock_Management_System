const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/usersRoutes");
const productRoutes = require("./routes/productsRoutes");
const transactionRoutes = require("./routes/transactionsRoutes");
const app = express();

app.use(cors());
app.use(bodyParser.json());

require("./config/db");

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Stock Management API 😁😁" });
});

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/transactions", transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

app.listen(3008, () =>
  console.log("Backend is running on port http://localhost:3008  🌼")
);