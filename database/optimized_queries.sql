-- Optimized queries for fast performance without materialized tables

-- 1. Add proper indexes to existing tables
CREATE INDEX idx_orders_store_date ON orders(storeID, orderDate);
CREATE INDEX idx_orders_date ON orders(orderDate);
CREATE INDEX idx_orderitems_product ON orderitems(productID);
CREATE INDEX idx_products_category_size ON products(Category, Size);
CREATE INDEX idx_products_sku ON products(SKU);

-- 2. Optimized bestsellers query with proper indexing
SELECT 
    p.SKU,
    p.Name,
    p.Category,
    p.Size,
    p.Price,
    s.storeID,
    s.city,
    s.state,
    COUNT(*) as total_orders,
    SUM(p.Price) as total_revenue
FROM orders o
JOIN orderitems oi ON o.orderID = oi.orderID
JOIN products p ON oi.productID = p.SKU
JOIN stores s ON o.storeID = s.storeID
WHERE o.orderDate BETWEEN '2024-01-01' AND '2024-01-31'
    AND (o.storeID = 'STORE001' OR 'STORE001' IS NULL)
    AND (p.Category = 'Pizza' OR 'Pizza' IS NULL)
    AND (p.Size = 'Large' OR 'Large' IS NULL)
GROUP BY p.SKU, p.Name, p.Category, p.Size, p.Price, s.storeID, s.city, s.state
ORDER BY total_orders DESC
LIMIT 10;

-- 3. Optimized worst sellers query
SELECT 
    p.SKU,
    p.Name,
    p.Category,
    p.Size,
    p.Price,
    s.storeID,
    s.city,
    s.state,
    COUNT(*) as total_orders,
    SUM(p.Price) as total_revenue
FROM orders o
JOIN orderitems oi ON o.orderID = oi.orderID
JOIN products p ON oi.productID = p.SKU
JOIN stores s ON o.storeID = s.storeID
WHERE o.orderDate BETWEEN '2024-01-01' AND '2024-01-31'
    AND (o.storeID = 'STORE001' OR 'STORE001' IS NULL)
    AND (p.Category = 'Pizza' OR 'Pizza' IS NULL)
    AND (p.Size = 'Large' OR 'Large' IS NULL)
GROUP BY p.SKU, p.Name, p.Category, p.Size, p.Price, s.storeID, s.city, s.state
HAVING total_orders > 0
ORDER BY total_orders ASC
LIMIT 10;

-- 4. Optimized query with window functions for ranking
SELECT 
    p.SKU,
    p.Name,
    p.Category,
    p.Size,
    p.Price,
    s.storeID,
    s.city,
    s.state,
    COUNT(*) as total_orders,
    SUM(p.Price) as total_revenue,
    ROW_NUMBER() OVER (PARTITION BY s.storeID ORDER BY COUNT(*) DESC) as store_rank
FROM orders o
JOIN orderitems oi ON o.orderID = oi.orderID
JOIN products p ON oi.productID = p.SKU
JOIN stores s ON o.storeID = s.storeID
WHERE o.orderDate BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY p.SKU, p.Name, p.Category, p.Size, p.Price, s.storeID, s.city, s.state
HAVING store_rank <= 5; 