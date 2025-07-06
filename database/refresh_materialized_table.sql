-- Script to refresh the materialized product sales table
-- Run this periodically to keep the data up to date

-- Clear existing data
TRUNCATE TABLE product_sales_materialized;

-- Repopulate with fresh data
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

-- Update the timestamp
UPDATE product_sales_materialized 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at < CURRENT_TIMESTAMP; 