-- Create materialized table for product sales analysis
-- This table will store aggregated sales data for fast querying

CREATE TABLE IF NOT EXISTS product_sales_materialized (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for fast filtering and sorting
    INDEX idx_store_date (store_id, sale_date),
    INDEX idx_product (product_sku),
    INDEX idx_category (product_category),
    INDEX idx_size (product_size),
    INDEX idx_date (sale_date),
    INDEX idx_orders (total_orders),
    INDEX idx_revenue (total_revenue)
);

-- Populate the materialized table with aggregated data
INSERT INTO product_sales_materialized (
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
GROUP BY p.SKU, o.storeID, DATE(o.orderDate), p.Category, p.Size, p.Price, s.city, s.state;

-- Create a view for easy querying of bestsellers
CREATE OR REPLACE VIEW bestsellers_view AS
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
    ROW_NUMBER() OVER (PARTITION BY store_id, sale_date ORDER BY total_orders DESC) as rank_by_orders,
    ROW_NUMBER() OVER (PARTITION BY store_id, sale_date ORDER BY total_revenue DESC) as rank_by_revenue
FROM product_sales_materialized;

-- Create a view for easy querying of worst sellers
CREATE OR REPLACE VIEW worstsellers_view AS
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
    ROW_NUMBER() OVER (PARTITION BY store_id, sale_date ORDER BY total_orders ASC) as rank_by_orders,
    ROW_NUMBER() OVER (PARTITION BY store_id, sale_date ORDER BY total_revenue ASC) as rank_by_revenue
FROM product_sales_materialized
WHERE total_orders > 0; 