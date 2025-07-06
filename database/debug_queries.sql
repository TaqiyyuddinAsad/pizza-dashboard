-- Debug queries to check your data

-- 1. Check if you have any data in your source tables
SELECT 'orders' as table_name, COUNT(*) as row_count FROM orders
UNION ALL
SELECT 'orderitems' as table_name, COUNT(*) as row_count FROM orderitems
UNION ALL
SELECT 'products' as table_name, COUNT(*) as row_count FROM products
UNION ALL
SELECT 'stores' as table_name, COUNT(*) as row_count FROM stores;

-- 2. Check if orders have valid dates
SELECT 
    COUNT(*) as total_orders,
    COUNT(orderDate) as orders_with_date,
    MIN(orderDate) as earliest_date,
    MAX(orderDate) as latest_date
FROM orders;

-- 3. Check if orderitems have valid product references
SELECT 
    COUNT(*) as total_orderitems,
    COUNT(DISTINCT productID) as unique_products,
    COUNT(DISTINCT orderID) as unique_orders
FROM orderitems;

-- 4. Check if products exist for orderitems
SELECT 
    COUNT(*) as orderitems_with_products
FROM orderitems oi
JOIN products p ON oi.productID = p.SKU;

-- 5. Check if stores exist for orders
SELECT 
    COUNT(*) as orders_with_stores
FROM orders o
JOIN stores s ON o.storeID = s.storeID;

-- 6. Test the basic JOIN that should work
SELECT 
    COUNT(*) as total_joined_records
FROM orders o
JOIN orderitems oi ON o.orderID = oi.orderID
JOIN products p ON oi.productID = p.SKU
JOIN stores s ON o.storeID = s.storeID
WHERE o.orderDate IS NOT NULL;

-- 7. Check your materialized table
SELECT 
    COUNT(*) as materialized_rows,
    MIN(sale_date) as earliest_sale_date,
    MAX(sale_date) as latest_sale_date
FROM product_sales_materialized;

-- 8. Check your view
SELECT 
    COUNT(*) as view_rows
FROM product_sales_summary;

-- 9. Test a simple query with sample data
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
GROUP BY p.SKU, p.Name, p.Category, p.Size, p.Price, s.storeID, s.city, s.state, DATE(o.orderDate)
LIMIT 5;

-- 10. Check for NULL values in key fields
SELECT 
    'orders.orderDate' as field, COUNT(*) as null_count FROM orders WHERE orderDate IS NULL
UNION ALL
SELECT 'orders.storeID' as field, COUNT(*) as null_count FROM orders WHERE storeID IS NULL
UNION ALL
SELECT 'orderitems.productID' as field, COUNT(*) as null_count FROM orderitems WHERE productID IS NULL
UNION ALL
SELECT 'products.SKU' as field, COUNT(*) as null_count FROM products WHERE SKU IS NULL; 