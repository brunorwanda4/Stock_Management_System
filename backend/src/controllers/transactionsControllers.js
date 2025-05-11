const db = require("../config/db");

exports.getAllTransactions = (req, res) => {
  const query = `
    SELECT t.*, p.productName, p.productCode, u.username 
    FROM Transactions t
    JOIN Products p ON t.productId = p.productId
    JOIN Users u ON t.madeBy = u.userId
    ORDER BY t.createdAt DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching transactions",
        error: err.message,
      });
    }
    res.status(200).json(results);
  });
};

exports.getTransactionById = (req, res) => {
  const transId = req.params.id;
  
  const query = `
    SELECT t.*, p.productName, p.productCode, u.username 
    FROM Transactions t
    JOIN Products p ON t.productId = p.productId
    JOIN Users u ON t.madeBy = u.userId
    WHERE t.transId = ?
  `;
  
  db.query(query, [transId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching transaction",
        error: err.message,
      });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(results[0]);
  });
};

exports.createTransaction = (req, res) => {
  const { productId, type, quantity } = req.body;
  const madeBy = req.user.userId; // From auth middleware
  
  if (!productId || !type || !quantity) {
    return res.status(400).json({ 
      message: "productId, type, and quantity are required" 
    });
  }
  
  if (type !== 'in' && type !== 'out') {
    return res.status(400).json({ 
      message: "Type must be either 'in' or 'out'" 
    });
  }
  
  if (quantity <= 0) {
    return res.status(400).json({ 
      message: "Quantity must be greater than 0" 
    });
  }
  
  // Start a transaction
  db.beginTransaction(err => {
    if (err) {
      return res.status(500).json({
        message: "Error starting transaction",
        error: err.message,
      });
    }
    
    // First check product exists and get current quantity
    db.query(
      "SELECT quantity FROM Products WHERE productId = ? FOR UPDATE",
      [productId],
      (err, productResults) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({
              message: "Error fetching product",
              error: err.message,
            });
          });
        }
        
        if (productResults.length === 0) {
          return db.rollback(() => {
            res.status(404).json({ message: "Product not found" });
          });
        }
        
        const currentQuantity = productResults[0].quantity;
        let newQuantity;
        
        if (type === 'in') {
          newQuantity = currentQuantity + quantity;
        } else { // type === 'out'
          if (currentQuantity < quantity) {
            return db.rollback(() => {
              res.status(400).json({ 
                message: "Insufficient stock for this transaction" 
              });
            });
          }
          newQuantity = currentQuantity - quantity;
        }
        
        // Update product quantity
        db.query(
          "UPDATE Products SET quantity = ? WHERE productId = ?",
          [newQuantity, productId],
          (err, updateResults) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({
                  message: "Error updating product quantity",
                  error: err.message,
                });
              });
            }
            
            // Create the transaction record
            db.query(
              "INSERT INTO Transactions (productId, madeBy, type, quantity) VALUES (?, ?, ?, ?)",
              [productId, madeBy, type, quantity],
              (err, insertResults) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({
                      message: "Error creating transaction",
                      error: err.message,
                    });
                  });
                }
                
                // Commit the transaction
                db.commit(err => {
                  if (err) {
                    return db.rollback(() => {
                      res.status(500).json({
                        message: "Error committing transaction",
                        error: err.message,
                      });
                    });
                  }
                  
                  res.status(201).json({ 
                    message: "Transaction created successfully",
                    transactionId: insertResults.insertId,
                    newQuantity: newQuantity
                  });
                });
              }
            );
          }
        );
      }
    );
  });
};

exports.getTransactionsByProduct = (req, res) => {
  const productId = req.params.productId;
  
  const query = `
    SELECT t.*, p.productName, p.productCode, u.username 
    FROM Transactions t
    JOIN Products p ON t.productId = p.productId
    JOIN Users u ON t.madeBy = u.userId
    WHERE t.productId = ?
    ORDER BY t.createdAt DESC
  `;
  
  db.query(query, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching transactions",
        error: err.message,
      });
    }
    res.status(200).json(results);
  });
};