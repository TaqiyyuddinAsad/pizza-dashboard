
DROP TABLE IF EXISTS product_bestsellers_store_materialized;

CREATE TABLE product_bestsellers_store_materialized (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_sku VARCHAR(10) NOT NULL,
    product_name VARCHAR(100),
    product_category VARCHAR(50),
    product_size VARCHAR(50),
    product_price DECIMAL(6,2),
    store_id VARCHAR(10),
    store_city VARCHAR(100),
    store_state VARCHAR(100),
    sale_date DATE,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_store_date (store_id, sale_date),
    INDEX idx_category_size_store_date (product_category, product_size, store_id, sale_date),
    INDEX idx_size_store_date (product_size, store_id, sale_date),
    INDEX idx_category_store_date (product_category, store_id, sale_date),
    INDEX idx_date (sale_date),
    INDEX idx_orders (total_orders),
    INDEX idx_revenue (total_revenue),
    UNIQUE KEY unique_product_store_date (product_sku, product_size, store_id, sale_date)
);


INSERT INTO product_bestsellers_store_materialized (
    product_sku, 
    product_name, 
    product_category, 
    product_size, 
    product_price,
    store_id,
    store_city,
    store_state,
    sale_date,
    total_orders,
    total_revenue
)
SELECT 
    p.SKU AS product_sku,
    p.Name AS product_name,
    p.Category AS product_category,
    p.Size AS product_size,
    p.Price AS product_price,
    o.storeID AS store_id,
    s.city AS store_city,
    s.state AS store_state,
    DATE(o.orderDate) AS sale_date,
    COUNT(*) AS total_orders,
    SUM(p.Price) AS total_revenue
FROM orders o
JOIN orderitems oi ON o.orderID = oi.orderID
JOIN products p ON oi.productID = p.SKU
JOIN stores s ON o.storeID = s.storeID
WHERE o.orderDate IS NOT NULL
GROUP BY p.SKU, p.Name, p.Category, p.Size, p.Price, o.storeID, s.city, s.state, DATE(o.orderDate);


SELECT COUNT(*) as total_rows FROM product_bestsellers_store_materialized;
SELECT COUNT(DISTINCT product_sku) as unique_products FROM product_bestsellers_store_materialized; 