-- Database views for fast queries (better than materialized tables)

-- 1. Create a view for product sales summary
CREATE OR REPLACE VIEW product_sales_summary AS
SELECT 
    p.SKU,
    p.Name,
    p.Category,
    p.Size,
    p.Price,
    s.storeID,
    s.city,
    s.state,
    DATE(o.orderDate) as sale_date,
    COUNT(*) as total_orders,
    SUM(p.Price) as total_revenue
FROM orders o
JOIN orderitems oi ON o.orderID = oi.orderID
JOIN products p ON oi.productID = p.SKU
JOIN stores s ON o.storeID = s.storeID
WHERE o.orderDate IS NOT NULL
GROUP BY p.SKU, p.Name, p.Category, p.Size, p.Price, s.storeID, s.city, s.state, DATE(o.orderDate);

-- 2. Create a view for bestsellers
CREATE OR REPLACE VIEW bestsellers_view AS
SELECT 
    *,
    ROW_NUMBER() OVER (PARTITION BY storeID, sale_date ORDER BY total_orders DESC) as rank_by_orders,
    ROW_NUMBER() OVER (PARTITION BY storeID, sale_date ORDER BY total_revenue DESC) as rank_by_revenue
FROM product_sales_summary;

-- 3. Create a view for worst sellers
CREATE OR REPLACE VIEW worstsellers_view AS
SELECT 
    *,
    ROW_NUMBER() OVER (PARTITION BY storeID, sale_date ORDER BY total_orders ASC) as rank_by_orders,
    ROW_NUMBER() OVER (PARTITION BY storeID, sale_date ORDER BY total_revenue ASC) as rank_by_revenue
FROM product_sales_summary
WHERE total_orders > 0;

-- 4. Query examples using views
-- Get top 10 bestsellers by orders
SELECT * FROM bestsellers_view 
WHERE storeID = 'STORE001' 
    AND sale_date BETWEEN '2024-01-01' AND '2024-01-31'
    AND rank_by_orders <= 10
ORDER BY sale_date, rank_by_orders;

-- Get top 10 bestsellers by revenue
SELECT * FROM bestsellers_view 
WHERE storeID = 'STORE001' 
    AND sale_date BETWEEN '2024-01-01' AND '2024-01-31'
    AND rank_by_revenue <= 10
ORDER BY sale_date, rank_by_revenue; 