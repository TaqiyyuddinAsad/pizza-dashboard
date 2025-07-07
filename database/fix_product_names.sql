-- Fix product names in product_orders_daily table
-- This script updates the product_name column with actual names from the products table

-- First, let's see what we have
SELECT 'Before fix - sample data:' as info;
SELECT product, product_name, storeID, day, orders 
FROM product_orders_daily 
ORDER BY day DESC, orders DESC 
LIMIT 5;

-- Update the product_name column with actual names from products table
UPDATE product_orders_daily pod
JOIN products p ON pod.product = p.SKU
SET pod.product_name = p.Name
WHERE pod.product_name IS NULL OR pod.product_name = pod.product;

-- Show the results
SELECT 'After fix - sample data:' as info;
SELECT product, product_name, storeID, day, orders 
FROM product_orders_daily 
ORDER BY day DESC, orders DESC 
LIMIT 5;

-- Check if any products still don't have names
SELECT 'Products still missing names:' as info;
SELECT DISTINCT product, product_name
FROM product_orders_daily 
WHERE product_name IS NULL OR product_name = product
LIMIT 10; 