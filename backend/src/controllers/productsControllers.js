const db = require("../config/db");

exports.getAllProducts = (req, res) => {
  db.query("SELECT * FROM Products", (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching products",
        error: err.message,
      });
    }
    res.status(200).json(results);
  });
};

exports.getProductById = (req, res) => {
  const productId = req.params.id;
  
  db.query("SELECT * FROM Products WHERE productId = ?", [productId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching product",
        error: err.message,
      });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(results[0]);
  });
};

exports.createProduct = (req, res) => {
  const { productCode, productName, unitPrice, quantity } = req.body;
  
  if (!productCode || !productName || !unitPrice) {
    return res.status(400).json({ 
      message: "productCode, productName, and unitPrice are required" 
    });
  }
  
  db.query(
    "INSERT INTO Products (productCode, productName, unitPrice, quantity) VALUES (?, ?, ?, ?)",
    [productCode, productName, unitPrice, quantity || 0],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Error creating product",
          error: err.message,
        });
      }
      res.status(201).json({ 
        message: "Product created successfully",
        productId: results.insertId 
      });
    }
  );
};

exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const { productCode, productName, unitPrice, quantity } = req.body;
  
  if (!productCode || !productName || !unitPrice) {
    return res.status(400).json({ 
      message: "productCode, productName, and unitPrice are required" 
    });
  }
  
  db.query(
    "UPDATE Products SET productCode = ?, productName = ?, unitPrice = ?, quantity = ? WHERE productId = ?",
    [productCode, productName, unitPrice, quantity || 0, productId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Error updating product",
          error: err.message,
        });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product updated successfully" });
    }
  );
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;
  
  db.query("DELETE FROM Products WHERE productId = ?", [productId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error deleting product",
        error: err.message,
      });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  });
};