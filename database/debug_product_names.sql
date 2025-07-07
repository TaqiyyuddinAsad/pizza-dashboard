-- Debug script to check product names issue
-- Run this to see what's actually in the tables

-- Check what's in product_orders_daily
SELECT 'product_orders_daily sample data:' as info;
SELECT product, product_name, storeID, day, orders 
FROM product_orders_daily 
ORDER BY day DESC, orders DESC 
LIMIT 10;

-- Check what's in products table
SELECT 'products table sample data:' as info;
SELECT SKU, Name, Category, Size 
FROM products 
ORDER BY SKU 
LIMIT 20;

-- Check if there are SKUs in orderitems that don't exist in products
SELECT 'SKUs in orderitems but not in products:' as info;
SELECT DISTINCT oi.productID 
FROM orderitems oi 
LEFT JOIN products p ON oi.productID = p.SKU 
WHERE p.SKU IS NULL 
LIMIT 10;

-- Check the most common SKUs in orderitems
SELECT 'Most common SKUs in orderitems:' as info;
SELECT oi.productID, COUNT(*) as count
FROM orderitems oi 
GROUP BY oi.productID 
ORDER BY count DESC 
LIMIT 10;

-- Check if the JOIN in the materialized table creation worked
SELECT 'Sample from materialized table creation query:' as info;
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
GROUP BY oi.productID, p.Name, o.storeID, DATE(o.orderDate)
ORDER BY day DESC, orders DESC
LIMIT 5; 