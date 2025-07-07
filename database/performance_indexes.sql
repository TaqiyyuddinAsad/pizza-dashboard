-- Performance indexes for customer analytics queries
-- These indexes will significantly improve query performance

-- Index for orders table - most important for date range queries
CREATE INDEX IF NOT EXISTS idx_orders_date_customer_store ON orders(orderDate, customerID, storeID);

-- Index for orderitems table - for joining with orders
CREATE INDEX IF NOT EXISTS idx_orderitems_order_product ON orderitems(orderID, productID);

-- Index for products table - for category and size filtering
CREATE INDEX IF NOT EXISTS idx_products_category_size ON products(Category, Size);

-- Composite index for the most common query pattern
CREATE INDEX IF NOT EXISTS idx_orders_date_store_customer ON orders(orderDate, storeID, customerID);

-- Index for customer analytics without product filters
CREATE INDEX IF NOT EXISTS idx_orders_customer_date ON orders(customerID, orderDate);

-- Index for revenue calculations
CREATE INDEX IF NOT EXISTS idx_orders_date_total ON orders(orderDate, total); 