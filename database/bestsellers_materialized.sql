
DROP TABLE IF EXISTS product_bestsellers_materialized;

CREATE TABLE product_bestsellers_materialized (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_sku VARCHAR(10) NOT NULL,
    product_name VARCHAR(100),
    product_category VARCHAR(50),
    product_size VARCHAR(50),
    product_price DECIMAL(6,2),
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    avg_orders_per_store DECIMAL(8,2) DEFAULT 0.00,
    stores_sold_in INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_category_size (product_category, product_size),
    INDEX idx_size (product_size),
    INDEX idx_category (product_category),
    INDEX idx_orders (total_orders),
    INDEX idx_revenue (total_revenue),
    UNIQUE KEY unique_product (product_sku, product_size)
);

INSERT INTO product_bestsellers_materialized (
    product_sku, 
    product_name, 
    product_category, 
    product_size, 
    product_price,
    total_orders,
    total_revenue,
    avg_orders_per_store,
    stores_sold_in
)
SELECT 
    p.SKU AS product_sku,
    p.Name AS product_name,
    p.Category AS product_category,
    p.Size AS product_size,
    p.Price AS product_price,
    COUNT(*) AS total_orders,
    SUM(p.Price) AS total_revenue,
    COUNT(*) / COUNT(DISTINCT o.storeID) AS avg_orders_per_store,
    COUNT(DISTINCT o.storeID) AS stores_sold_in
FROM orders o
JOIN orderitems oi ON o.orderID = oi.orderID
JOIN products p ON oi.productID = p.SKU
WHERE o.orderDate IS NOT NULL
GROUP BY p.SKU, p.Name, p.Category, p.Size, p.Price;

CREATE OR REPLACE VIEW bestsellers_view AS
SELECT 
    *,
    ROW_NUMBER() OVER (ORDER BY total_orders DESC) as rank_by_orders,
    ROW_NUMBER() OVER (ORDER BY total_revenue DESC) as rank_by_revenue,
    ROW_NUMBER() OVER (PARTITION BY product_size ORDER BY total_orders DESC) as rank_by_size_orders,
    ROW_NUMBER() OVER (PARTITION BY product_category ORDER BY total_orders DESC) as rank_by_category_orders
FROM product_bestsellers_materialized;

CREATE OR REPLACE VIEW worstsellers_view AS
SELECT 
    *,
    ROW_NUMBER() OVER (ORDER BY total_orders ASC) as rank_by_orders,
    ROW_NUMBER() OVER (ORDER BY total_revenue ASC) as rank_by_revenue,
    ROW_NUMBER() OVER (PARTITION BY product_size ORDER BY total_orders ASC) as rank_by_size_orders,
    ROW_NUMBER() OVER (PARTITION BY product_category ORDER BY total_orders ASC) as rank_by_category_orders
FROM product_bestsellers_materialized
WHERE total_orders > 0; 