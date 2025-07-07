-- Create the product_orders_daily materialized table for product ranking
-- This table aggregates daily product orders with store information
-- Run this script in your MySQL database

-- Drop the old table if it exists
DROP TABLE IF EXISTS product_orders_daily;

-- Create new materialized table for daily product orders
CREATE TABLE product_orders_daily (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(10) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    storeID VARCHAR(10) NOT NULL,
    day DATE NOT NULL,
    orders INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for fast filtering and sorting
    INDEX idx_product_day (product, day),
    INDEX idx_store_day (storeID, day),
    INDEX idx_day (day),
    INDEX idx_orders (orders),
    UNIQUE KEY unique_product_store_day (product, storeID, day)
);

-- Populate with daily aggregated data per product and store
INSERT INTO product_orders_daily (
    product,
    product_name,
    storeID,
    day,
    orders
)
SELECT 
    oi.productID AS product,
    p.Name AS product_name,
    o.storeID,
    DATE(o.orderDate) AS day,
    COUNT(*) AS orders
FROM orders o
JOIN orderitems oi ON o.orderID = oi.orderID
JOIN products p ON oi.productID = p.SKU
WHERE o.orderDate IS NOT NULL
GROUP BY oi.productID, p.Name, o.storeID, DATE(o.orderDate);

-- Verify the table was created and populated
SELECT COUNT(*) as total_rows FROM product_orders_daily;
SELECT COUNT(DISTINCT product) as unique_products FROM product_orders_daily;
SELECT COUNT(DISTINCT storeID) as unique_stores FROM product_orders_daily;

-- Show sample data
SELECT * FROM product_orders_daily ORDER BY day DESC, orders DESC LIMIT 10; 