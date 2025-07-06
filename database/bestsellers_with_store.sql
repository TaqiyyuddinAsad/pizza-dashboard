-- Enhanced materialized table with store and time filtering

-- Drop the old table if it exists
DROP TABLE IF EXISTS product_bestsellers_store_materialized;

-- Create new materialized table with store and time support
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
    
    -- Indexes for fast filtering and sorting
    INDEX idx_store_date (store_id, sale_date),
    INDEX idx_category_size_store_date (product_category, product_size, store_id, sale_date),
    INDEX idx_size_store_date (product_size, store_id, sale_date),
    INDEX idx_category_store_date (product_category, store_id, sale_date),
    INDEX idx_date (sale_date),
    INDEX idx_orders (total_orders),
    INDEX idx_revenue (total_revenue),
    UNIQUE KEY unique_product_store_date (product_sku, product_size, store_id, sale_date)
);

-- Populate with daily aggregated data per store
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

-- Create a view for overall bestsellers (aggregated across all stores and dates)
CREATE OR REPLACE VIEW bestsellers_overall_view AS
SELECT 
    product_sku,
    product_name,
    product_category,
    product_size,
    product_price,
    SUM(total_orders) as total_orders,
    SUM(total_revenue) as total_revenue,
    COUNT(DISTINCT sale_date) as days_sold,
    COUNT(DISTINCT store_id) as stores_sold_in,
    ROW_NUMBER() OVER (ORDER BY SUM(total_orders) DESC) as rank_by_orders,
    ROW_NUMBER() OVER (ORDER BY SUM(total_revenue) DESC) as rank_by_revenue,
    ROW_NUMBER() OVER (PARTITION BY product_size ORDER BY SUM(total_orders) DESC) as rank_by_size_orders,
    ROW_NUMBER() OVER (PARTITION BY product_category ORDER BY SUM(total_orders) DESC) as rank_by_category_orders
FROM product_bestsellers_store_materialized
GROUP BY product_sku, product_name, product_category, product_size, product_price;

-- Create a view for store-specific bestsellers
CREATE OR REPLACE VIEW bestsellers_store_view AS
SELECT 
    product_sku,
    product_name,
    product_category,
    product_size,
    product_price,
    store_id,
    store_city,
    store_state,
    SUM(total_orders) as total_orders,
    SUM(total_revenue) as total_revenue,
    COUNT(DISTINCT sale_date) as days_sold,
    ROW_NUMBER() OVER (PARTITION BY store_id ORDER BY SUM(total_orders) DESC) as rank_by_store_orders,
    ROW_NUMBER() OVER (PARTITION BY store_id, product_size ORDER BY SUM(total_orders) DESC) as rank_by_store_size_orders,
    ROW_NUMBER() OVER (PARTITION BY store_id, product_category ORDER BY SUM(total_orders) DESC) as rank_by_store_category_orders
FROM product_bestsellers_store_materialized
GROUP BY product_sku, product_name, product_category, product_size, product_price, store_id, store_city, store_state;

-- Create a view for time-filtered store bestsellers
CREATE OR REPLACE VIEW bestsellers_store_time_view AS
SELECT 
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
    total_revenue,
    ROW_NUMBER() OVER (PARTITION BY store_id ORDER BY total_orders DESC) as rank_by_store_orders,
    ROW_NUMBER() OVER (PARTITION BY store_id, product_size ORDER BY total_orders DESC) as rank_by_store_size_orders
FROM product_bestsellers_store_materialized; 