CREATE DATABASE stoke_management;
USE stoke_management;

CREATE TABLE Users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('owner', 'employee') NOT NULL,
    isNew BOOLEAN NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Products (
    productId INT AUTO_INCREMENT PRIMARY KEY,
    productCode VARCHAR(10) UNIQUE NOT NULL,
    productName VARCHAR(100) UNIQUE NOT NULL,
    unitPrice DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 0 NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Transactions (
    transId INT AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    madeBy INT NOT NULL,
    type ENUM('in', 'out') NOT NULL,
    quantity INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES Products(productId),
    FOREIGN KEY (madeBy) REFERENCES Users(userId)
);
