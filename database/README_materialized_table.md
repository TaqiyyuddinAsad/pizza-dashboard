# Materialized Product Sales Table

This document explains how to set up and use the materialized table for fast product sales analysis with filtering by store and date.

## Overview

The materialized table `product_sales_materialized` stores pre-aggregated sales data to enable fast querying of bestsellers and worst sellers with various filters.

## Setup Instructions

### 1. Create the Materialized Table

Run the SQL script to create the table and populate it with data:

```sql
-- Execute this in your MySQL database
source database/materialized_product_sales.sql;
```

### 2. Refresh the Table Periodically

To keep the data up-to-date, run the refresh script:

```sql
-- Execute this periodically (e.g., daily)
source database/refresh_materialized_table.sql;
```

### 3. Set up Automated Refresh (Optional)

You can set up a cron job or use Spring Boot's `@Scheduled` annotation to automatically refresh the table:

```java
@Scheduled(cron = "0 0 2 * * ?") // Refresh daily at 2 AM
public void refreshMaterializedTable() {
    // Execute the refresh SQL
}
```

## Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT | Primary key |
| `product_sku` | VARCHAR(10) | Product SKU |
| `product_name` | VARCHAR(100) | Product name |
| `product_category` | VARCHAR(50) | Product category |
| `product_size` | VARCHAR(50) | Product size |
| `product_price` | DECIMAL(6,2) | Product price |
| `store_id` | VARCHAR(10) | Store ID |
| `store_city` | VARCHAR(100) | Store city |
| `store_state` | VARCHAR(100) | Store state |
| `sale_date` | DATE | Sale date |
| `total_orders` | INT | Total orders for this product/store/date |
| `total_revenue` | DECIMAL(10,2) | Total revenue for this product/store/date |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Record last update time |

## Indexes

The table includes the following indexes for optimal performance:

- `idx_store_date` (store_id, sale_date) - For filtering by store and date
- `idx_product` (product_sku) - For filtering by product
- `idx_category` (product_category) - For filtering by category
- `idx_size` (product_size) - For filtering by size
- `idx_date` (sale_date) - For date range queries
- `idx_orders` (total_orders) - For ordering by orders
- `idx_revenue` (total_revenue) - For ordering by revenue

## API Endpoints

### Bestsellers

- `GET /api/materialized-sales/bestsellers/orders` - Get bestsellers by orders
- `GET /api/materialized-sales/bestsellers/revenue` - Get bestsellers by revenue

### Worst Sellers

- `GET /api/materialized-sales/worstsellers/orders` - Get worst sellers by orders
- `GET /api/materialized-sales/worstsellers/revenue` - Get worst sellers by revenue

### Filtering Options

All endpoints support the following query parameters:

- `storeId` - Filter by specific store
- `startDate` - Start date for date range (ISO format: YYYY-MM-DD)
- `endDate` - End date for date range (ISO format: YYYY-MM-DD)
- `category` - Filter by product category
- `size` - Filter by product size
- `page` - Page number (default: 0)
- `pageSize` - Items per page (default: 10)

### Example API Calls

```bash
# Get bestsellers by orders for a specific store and date range
curl "http://localhost:8080/api/materialized-sales/bestsellers/orders?storeId=STORE001&startDate=2024-01-01&endDate=2024-01-31&page=0&pageSize=10"

# Get worst sellers by revenue for all stores
curl "http://localhost:8080/api/materialized-sales/worstsellers/revenue?startDate=2024-01-01&endDate=2024-01-31&category=Pizza&size=Large"

# Get total count for bestsellers
curl "http://localhost:8080/api/materialized-sales/bestsellers/count?storeId=STORE001&startDate=2024-01-01&endDate=2024-01-31"
```

## Sample Queries

See `database/sample_queries.sql` for examples of direct SQL queries you can run against the materialized table.

## Performance Benefits

1. **Fast Queries**: Pre-aggregated data eliminates the need for complex JOINs and GROUP BY operations
2. **Efficient Filtering**: Indexed columns enable fast filtering by store, date, category, and size
3. **Pagination Support**: Optimized for paginated results
4. **Reduced Load**: Offloads complex calculations from the main database

## Maintenance

### Regular Tasks

1. **Daily Refresh**: Update the materialized table with new data
2. **Index Maintenance**: Monitor and rebuild indexes as needed
3. **Storage Monitoring**: Track table size and growth

### Monitoring Queries

```sql
-- Check table size
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'pizza_db' 
AND table_name = 'product_sales_materialized';

-- Check last refresh time
SELECT MAX(updated_at) FROM product_sales_materialized;

-- Check data freshness
SELECT 
    MIN(sale_date) as earliest_date,
    MAX(sale_date) as latest_date,
    COUNT(*) as total_records
FROM product_sales_materialized;
```

## Troubleshooting

### Common Issues

1. **Outdated Data**: Run the refresh script to update the table
2. **Slow Queries**: Check if indexes are being used with `EXPLAIN`
3. **Missing Data**: Verify that the source tables have data for the specified date range

### Performance Tuning

1. **Adjust Indexes**: Add composite indexes for frequently used filter combinations
2. **Partitioning**: Consider partitioning by date for very large datasets
3. **Compression**: Enable table compression for storage optimization 