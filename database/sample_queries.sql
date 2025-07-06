-- Sample queries for the materialized product sales table

-- 1. Get bestsellers by orders for a specific store and date range
SELECT 
    product_name,
    product_category,
    product_size,
    product_price,
    total_orders,
    total_revenue,
    sale_date
FROM product_sales_materialized
WHERE store_id = 'STORE001' 
    AND sale_date BETWEEN '2024-01-01' AND '2024-01-31'
ORDER BY total_orders DESC
LIMIT 10;

-- 2. Get worst sellers by orders for a specific store and date range
SELECT 
    product_name,
    product_category,
    product_size,
    product_price,
    total_orders,
    total_revenue,
    sale_date
FROM product_sales_materialized
WHERE store_id = 'STORE001' 
    AND sale_date BETWEEN '2024-01-01' AND '2024-01-31'
    AND total_orders > 0
ORDER BY total_orders ASC
LIMIT 10;

-- 3. Get bestsellers by revenue for all stores in a date range
SELECT 
    product_name,
    product_category,
    product_size,
    store_city,
    store_state,
    total_orders,
    total_revenue,
    sale_date
FROM product_sales_materialized
WHERE sale_date BETWEEN '2024-01-01' AND '2024-01-31'
ORDER BY total_revenue DESC
LIMIT 20;

-- 4. Get bestsellers by category for a specific store
SELECT 
    product_name,
    product_category,
    product_size,
    total_orders,
    total_revenue,
    sale_date
FROM product_sales_materialized
WHERE store_id = 'STORE001' 
    AND product_category = 'Pizza'
    AND sale_date BETWEEN '2024-01-01' AND '2024-01-31'
ORDER BY total_orders DESC
LIMIT 10;

-- 5. Get bestsellers by size for a specific store
SELECT 
    product_name,
    product_category,
    product_size,
    total_orders,
    total_revenue,
    sale_date
FROM product_sales_materialized
WHERE store_id = 'STORE001' 
    AND product_size = 'Large'
    AND sale_date BETWEEN '2024-01-01' AND '2024-01-31'
ORDER BY total_orders DESC
LIMIT 10;

-- 6. Get daily bestsellers for a store (top 5 each day)
SELECT 
    product_name,
    product_category,
    product_size,
    total_orders,
    total_revenue,
    sale_date,
    ROW_NUMBER() OVER (PARTITION BY sale_date ORDER BY total_orders DESC) as daily_rank
FROM product_sales_materialized
WHERE store_id = 'STORE001' 
    AND sale_date BETWEEN '2024-01-01' AND '2024-01-31'
HAVING daily_rank <= 5
ORDER BY sale_date, daily_rank;

-- 7. Get total sales summary by store and date range
SELECT 
    store_id,
    store_city,
    store_state,
    COUNT(DISTINCT product_sku) as unique_products,
    SUM(total_orders) as total_orders,
    SUM(total_revenue) as total_revenue,
    MIN(sale_date) as first_sale_date,
    MAX(sale_date) as last_sale_date
FROM product_sales_materialized
WHERE sale_date BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY store_id, store_city, store_state
ORDER BY total_revenue DESC;

-- 8. Get products with zero sales (potential worst sellers)
SELECT 
    p.SKU,
    p.Name,
    p.Category,
    p.Size,
    p.Price,
    s.storeID,
    s.city,
    s.state
FROM products p
CROSS JOIN stores s
LEFT JOIN product_sales_materialized psm 
    ON p.SKU = psm.product_sku 
    AND s.storeID = psm.store_id
    AND psm.sale_date BETWEEN '2024-01-01' AND '2024-01-31'
WHERE psm.product_sku IS NULL
ORDER BY p.Category, p.Name, s.city; 