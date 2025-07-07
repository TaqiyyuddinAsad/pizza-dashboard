

DROP TABLE IF EXISTS product_orders_daily;

CREATE TABLE product_orders_daily (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(10) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    storeID VARCHAR(10) NOT NULL,
    day DATE NOT NULL,
    orders INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_product_day (product, day),
    INDEX idx_store_day (storeID, day),
    INDEX idx_day (day),
    INDEX idx_orders (orders),
    UNIQUE KEY unique_product_store_day (product, storeID, day)
);

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

SELECT COUNT(*) as total_rows FROM product_orders_daily;
SELECT COUNT(DISTINCT product) as unique_products FROM product_orders_daily;
SELECT COUNT(DISTINCT storeID) as unique_stores FROM product_orders_daily;

SELECT * FROM product_orders_daily ORDER BY day DESC, orders DESC LIMIT 10; 