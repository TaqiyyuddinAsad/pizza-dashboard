-- Enhanced materialized table with time filtering

-- Drop the old table if it exists
DROP TABLE IF EXISTS product_bestsellers_time_materialized;

-- Create new materialized table with time support
CREATE TABLE product_bestsellers_time_materialized (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_sku VARCHAR(10) NOT NULL,
    product_name VARCHAR(100),
    product_category VARCHAR(50),
    product_size VARCHAR(50),
    product_price DECIMAL(6,2),
    sale_date DATE,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for fast filtering and sorting
    INDEX idx_category_size_date (product_category, product_size, sale_date),
    INDEX idx_size_date (product_size, sale_date),
    INDEX idx_category_date (product_category, sale_date),
    INDEX idx_date (sale_date),
    INDEX idx_orders (total_orders),
    INDEX idx_revenue (total_revenue),
    UNIQUE KEY unique_product_date (product_sku, product_size, sale_date)
);

-- Populate with daily aggregated data
INSERT INTO product_bestsellers_time_materialized (
    product_sku, 
    product_name, 
    product_category, 
    product_size, 
    product_price,
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
    DATE(o.orderDate) AS sale_date,
    COUNT(*) AS total_orders,
    SUM(p.Price) AS total_revenue
FROM orders o
JOIN orderitems oi ON o.orderID = oi.orderID
JOIN products p ON oi.productID = p.SKU
WHERE o.orderDate IS NOT NULL
GROUP BY p.SKU, p.Name, p.Category, p.Size, p.Price, DATE(o.orderDate);

-- Create a view for overall bestsellers (aggregated across all dates)
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
    ROW_NUMBER() OVER (ORDER BY SUM(total_orders) DESC) as rank_by_orders,
    ROW_NUMBER() OVER (ORDER BY SUM(total_revenue) DESC) as rank_by_revenue,
    ROW_NUMBER() OVER (PARTITION BY product_size ORDER BY SUM(total_orders) DESC) as rank_by_size_orders,
    ROW_NUMBER() OVER (PARTITION BY product_category ORDER BY SUM(total_orders) DESC) as rank_by_category_orders
FROM product_bestsellers_time_materialized
GROUP BY product_sku, product_name, product_category, product_size, product_price;

-- Create a view for time-filtered bestsellers
CREATE OR REPLACE VIEW bestsellers_time_view AS
SELECT 
    product_sku,
    product_name,
    product_category,
    product_size,
    product_price,
    sale_date,
    total_orders,
    total_revenue,
    ROW_NUMBER() OVER (ORDER BY total_orders DESC) as rank_by_orders,
    ROW_NUMBER() OVER (ORDER BY total_revenue DESC) as rank_by_revenue,
    ROW_NUMBER() OVER (PARTITION BY product_size ORDER BY total_orders DESC) as rank_by_size_orders,
    ROW_NUMBER() OVER (PARTITION BY product_category ORDER BY total_orders DESC) as rank_by_category_orders,
    ROW_NUMBER() OVER (PARTITION BY DATE_FORMAT(sale_date, '%Y-%m') ORDER BY total_orders DESC) as rank_by_month_orders
FROM product_bestsellers_time_materialized;

-- Create a view for monthly aggregated bestsellers
CREATE OR REPLACE VIEW bestsellers_monthly_view AS
SELECT 
    product_sku,
    product_name,
    product_category,
    product_size,
    product_price,
    DATE_FORMAT(sale_date, '%Y-%m') as month,
    SUM(total_orders) as total_orders,
    SUM(total_revenue) as total_revenue,
    ROW_NUMBER() OVER (PARTITION BY DATE_FORMAT(sale_date, '%Y-%m') ORDER BY SUM(total_orders) DESC) as rank_by_month_orders,
    ROW_NUMBER() OVER (PARTITION BY DATE_FORMAT(sale_date, '%Y-%m'), product_size ORDER BY SUM(total_orders) DESC) as rank_by_month_size_orders
FROM product_bestsellers_time_materialized
GROUP BY product_sku, product_name, product_category, product_size, product_price, DATE_FORMAT(sale_date, '%Y-%m'); 