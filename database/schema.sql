CREATE TABLE customers (
    customerID VARCHAR(10) PRIMARY KEY,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

CREATE TABLE stores (
    storeID VARCHAR(10) PRIMARY KEY,
    zipcode VARCHAR(10),
    state_abbr VARCHAR(5),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    city VARCHAR(100),
    state VARCHAR(100),
    distance DECIMAL(10,6)
);

CREATE TABLE products (
    SKU VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(100),
    Price DECIMAL(6,2),
    Category VARCHAR(50),
    Size VARCHAR(50),
    Ingredients TEXT,
    Launch DATE
);

CREATE TABLE orders (
    orderID INT PRIMARY KEY,
    customerID VARCHAR(10),
    storeID VARCHAR(10),
    orderDate DATETIME,
    nItems INT,
    total DECIMAL(6,2),
    FOREIGN KEY (customerID) REFERENCES customers(customerID),
    FOREIGN KEY (storeID) REFERENCES stores(storeID)
);

CREATE TABLE orderItems (
    orderID INT,
    SKU VARCHAR(10),
    PRIMARY KEY (orderID, SKU),
    FOREIGN KEY (orderID) REFERENCES orders(orderID),
    FOREIGN KEY (SKU) REFERENCES products(SKU)
);
