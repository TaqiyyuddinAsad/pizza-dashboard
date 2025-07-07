package com.example.pizzadash.repository;

import com.example.pizzadash.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Repository
public class OrderRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<OrdersDTO> getOrdersGroupedByWeekday(LocalDate start, LocalDate end, List<String> stores, List<String> categories, List<String> sizes) {
        StringBuilder sql = new StringBuilder("""
            SELECT DAYNAME(o.orderDate) AS label, COUNT(*) AS orders
            FROM orders o
            JOIN orderitems oi ON o.orderID = oi.orderID
            JOIN products p ON oi.productID = p.SKU
            WHERE o.orderDate BETWEEN ? AND ?
        """);
        List<Object> params = new ArrayList<>();
        params.add(start);
        params.add(end);
        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (").append(String.join(",", Collections.nCopies(stores.size(), "?"))).append(")");
            params.addAll(stores);
        }
        if (categories != null && !categories.isEmpty()) {
            sql.append(" AND p.Category IN (").append(String.join(",", Collections.nCopies(categories.size(), "?"))).append(")");
            params.addAll(categories);
        }
        if (sizes != null && !sizes.isEmpty()) {
            sql.append(" AND p.Size IN (").append(String.join(",", Collections.nCopies(sizes.size(), "?"))).append(")");
            params.addAll(sizes);
        }
        sql.append(" GROUP BY label ORDER BY FIELD(label, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')");
        return jdbcTemplate.query(
            sql.toString(),
            params.toArray(),
            (rs, rowNum) -> new OrdersDTO(
                rs.getString("label"),
                rs.getInt("orders")
            )
        );
    }

    public Map<String, Object> getKpiSummary(LocalDate start, LocalDate end, List<String> stores, List<String> categories, List<String> sizes) {
        boolean hasProductFilter = (categories != null && !categories.isEmpty()) || (sizes != null && !sizes.isEmpty());
        
        // Get order-based KPIs (always apply all filters)
        Map<String, Object> orderKpis = getOrderKpis(start, end, stores, categories, sizes);
        
        // Get customer-based KPIs (only apply store filters, not product filters)
        Map<String, Object> customerKpis = getCustomerKpis(start, end, stores);
        
        // Combine results
        Map<String, Object> result = new HashMap<>();
        result.putAll(orderKpis);
        result.putAll(customerKpis);
        
        return result;
    }
    
    private Map<String, Object> getOrderKpis(LocalDate start, LocalDate end, List<String> stores, List<String> categories, List<String> sizes) {
        boolean hasProductFilter = (categories != null && !categories.isEmpty()) || (sizes != null && !sizes.isEmpty());
        
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();
        params.add(start);
        params.add(end);
        
        if (!hasProductFilter) {
            sql.append("SELECT COUNT(DISTINCT o.orderID) AS totalOrders, SUM(o.total) AS revenue, SUM(o.nItems) AS totalItems FROM orders o WHERE o.orderDate BETWEEN ? AND ?");
            if (stores != null && !stores.isEmpty()) {
                sql.append(" AND o.storeID IN (")
                   .append(String.join(",", Collections.nCopies(stores.size(), "?")))
                   .append(")");
                params.addAll(stores);
            }
        } else {
            sql.append("SELECT COUNT(DISTINCT o.orderID) AS totalOrders, SUM(p.price) AS revenue, COUNT(oi.productID) AS totalItems FROM orders o ");
            sql.append("JOIN orderitems oi ON o.orderID = oi.orderID ");
            sql.append("JOIN products p ON oi.productID = p.SKU ");
            sql.append("WHERE o.orderDate BETWEEN ? AND ?");
            if (stores != null && !stores.isEmpty()) {
                sql.append(" AND o.storeID IN (")
                   .append(String.join(",", Collections.nCopies(stores.size(), "?")))
                   .append(")");
                params.addAll(stores);
            }
            if (categories != null && !categories.isEmpty()) {
                String placeholders = String.join(",", Collections.nCopies(categories.size(), "?"));
                sql.append(" AND p.Category IN (").append(placeholders).append(")");
                params.addAll(categories);
            }
            if (sizes != null && !sizes.isEmpty()) {
                String placeholders = String.join(",", Collections.nCopies(sizes.size(), "?"));
                sql.append(" AND p.Size IN (").append(placeholders).append(")");
                params.addAll(sizes);
            }
        }
        
        Map<String, Object> result;
        try {
            result = jdbcTemplate.queryForMap(sql.toString(), params.toArray());
        } catch (Exception e) {
            result = new HashMap<>();
            result.put("totalOrders", 0);
            result.put("revenue", 0.0);
            result.put("totalItems", 0);
        }
        
        // Calculate average order value
        Double revenue = ((Number) result.get("revenue")).doubleValue();
        Integer totalOrders = ((Number) result.get("totalOrders")).intValue();
        Double avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0.0;
        
        Map<String, Object> orderKpis = new HashMap<>();
        orderKpis.put("Revenue", revenue);
        orderKpis.put("Avg Order Value", avgOrderValue);
        orderKpis.put("Total Orders", totalOrders);
        orderKpis.put("Total Items", ((Number) result.get("totalItems")).intValue());
        
        return orderKpis;
    }
    
    private Map<String, Object> getCustomerKpis(LocalDate start, LocalDate end, List<String> stores) {
        Map<String, Object> customerKpis = new HashMap<>();
        
        // 1. Average days between first and second order
        Double avgDaysBetweenOrders = 0.0;
        try {
            StringBuilder avgDaysSql = new StringBuilder();
            List<Object> avgDaysParams = new ArrayList<>();
            
            avgDaysSql.append("SELECT AVG(diff) FROM (\n" +
                "  SELECT DATEDIFF(MIN(CASE WHEN rn=2 THEN orderDate END), MIN(CASE WHEN rn=1 THEN orderDate END)) AS diff\n" +
                "  FROM (\n" +
                "    SELECT o.customerID, o.orderDate, ROW_NUMBER() OVER (PARTITION BY o.customerID ORDER BY o.orderDate) rn\n" +
                "    FROM orders o");
            
            avgDaysSql.append(" WHERE o.orderDate BETWEEN ? AND ?");
            avgDaysParams.add(start);
            avgDaysParams.add(end);
            
            if (stores != null && !stores.isEmpty()) {
                avgDaysSql.append(" AND o.storeID IN (").append(String.join(",", Collections.nCopies(stores.size(), "?"))).append(")");
                avgDaysParams.addAll(stores);
            }
            
            avgDaysSql.append("  ) t\n" +
                "  WHERE rn IN (1,2)\n" +
                "  GROUP BY customerID\n" +
                "  HAVING COUNT(*) > 1\n" +
                ") x");
            
            avgDaysBetweenOrders = jdbcTemplate.queryForObject(avgDaysSql.toString(), Double.class, avgDaysParams.toArray());
            if (avgDaysBetweenOrders == null) avgDaysBetweenOrders = 0.0;
        } catch (Exception e) { 
            avgDaysBetweenOrders = 0.0; 
        }
        customerKpis.put("AvgDaysBetweenOrders", avgDaysBetweenOrders);
        
        // 2. Average delivery distance
        Double avgDeliveryDistance = 0.0;
        try {
            StringBuilder avgDistanceSql = new StringBuilder();
            List<Object> avgDistanceParams = new ArrayList<>();
            
            avgDistanceSql.append("SELECT AVG(\n" +
                "  6371 * 2 * ASIN(SQRT(\n" +
                "    POWER(SIN(RADIANS((c.latitude - s.latitude)/2)),2) +\n" +
                "    COS(RADIANS(s.latitude)) * COS(RADIANS(c.latitude)) *\n" +
                "    POWER(SIN(RADIANS((c.longitude - s.longitude)/2)),2)\n" +
                "  ))\n" +
                ") AS distance\n" +
                "FROM orders o\n" +
                "JOIN customers c ON o.customerID = c.customerID\n" +
                "JOIN stores s ON o.storeID = s.storeID");
            
            avgDistanceSql.append(" WHERE o.orderDate BETWEEN ? AND ?");
            avgDistanceParams.add(start);
            avgDistanceParams.add(end);
            
            if (stores != null && !stores.isEmpty()) {
                avgDistanceSql.append(" AND o.storeID IN (").append(String.join(",", Collections.nCopies(stores.size(), "?"))).append(")");
                avgDistanceParams.addAll(stores);
            }
            
            avgDeliveryDistance = jdbcTemplate.queryForObject(avgDistanceSql.toString(), Double.class, avgDistanceParams.toArray());
            if (avgDeliveryDistance == null) avgDeliveryDistance = 0.0;
        } catch (Exception e) { 
            avgDeliveryDistance = 0.0; 
        }
        customerKpis.put("AvgDeliveryDistance", avgDeliveryDistance);
        
        // 3. Repeat customer rate (Option 2)
        Double repeatCustomerRate = 0.0;
        try {
            StringBuilder repeatSql = new StringBuilder();
            List<Object> repeatParams = new ArrayList<>();
            repeatSql.append("SELECT 100.0 * COUNT(*) / NULLIF((SELECT COUNT(DISTINCT customerID) FROM orders WHERE orderDate BETWEEN ? AND ?");
            repeatParams.add(start);
            repeatParams.add(end);
            if (stores != null && !stores.isEmpty()) {
                repeatSql.append(" AND storeID IN (").append(String.join(",", Collections.nCopies(stores.size(), "?"))).append(")");
                repeatParams.addAll(stores);
            }
            repeatSql.append("), 0) FROM (SELECT customerID FROM orders WHERE orderDate BETWEEN ? AND ?");
            repeatParams.add(start);
            repeatParams.add(end);
            if (stores != null && !stores.isEmpty()) {
                repeatSql.append(" AND storeID IN (").append(String.join(",", Collections.nCopies(stores.size(), "?"))).append(")");
                repeatParams.addAll(stores);
            }
            repeatSql.append(" GROUP BY customerID HAVING COUNT(*) > 1) repeaters");
            repeatCustomerRate = jdbcTemplate.queryForObject(repeatSql.toString(), Double.class, repeatParams.toArray());
            if (repeatCustomerRate == null) repeatCustomerRate = 0.0;
        } catch (Exception e) { 
            repeatCustomerRate = 0.0; 
        }
        customerKpis.put("RepeatRate", repeatCustomerRate);
        
        // 4. Durchschnittliche Gesamtkunden (wie in der Chart)
        try {
            // Berechne für jede Periode die Anzahl der distinct customers
            String periodExpr;
            long days = ChronoUnit.DAYS.between(start, end) + 1;
            long years = ChronoUnit.YEARS.between(start.withDayOfYear(1), end.withDayOfYear(1)) + 1;
            if (days <= 31) {
                periodExpr = "DATE(orderDate)";
            } else if (years <= 2) {
                periodExpr = "DATE_FORMAT(orderDate, '%Y-%m')";
            } else {
                periodExpr = "YEAR(orderDate)";
            }
            StringBuilder avgCustomersSql = new StringBuilder();
            avgCustomersSql.append("SELECT AVG(cnt) FROM (")
                .append("SELECT ").append(periodExpr).append(" AS period, COUNT(DISTINCT customerID) AS cnt FROM orders WHERE orderDate BETWEEN ? AND ? ");
            List<Object> avgCustomersParams = new ArrayList<>();
            avgCustomersParams.add(start);
            avgCustomersParams.add(end);
            if (stores != null && !stores.isEmpty()) {
                avgCustomersSql.append("AND storeID IN (")
                    .append(String.join(",", Collections.nCopies(stores.size(), "?")))
                    .append(") ");
                avgCustomersParams.addAll(stores);
            }
            avgCustomersSql.append("GROUP BY period) t");
            Double avgCustomers = jdbcTemplate.queryForObject(avgCustomersSql.toString(), Double.class, avgCustomersParams.toArray());
            if (avgCustomers == null) avgCustomers = 0.0;
            customerKpis.put("Durchschnittliche Gesamtkunden", avgCustomers.intValue());
        } catch (Exception e) {
            customerKpis.put("Durchschnittliche Gesamtkunden", 0);
        }
        
        return customerKpis;
    }

    public List<RankingEntry> getProductRanking(LocalDate start, LocalDate end, String store) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();
        
        sql.append("""
            SELECT product_name, SUM(orders) AS total_orders
            FROM product_orders_daily
            WHERE day BETWEEN ? AND ?
        """);
        params.add(start);
        params.add(end);
        
        if (store != null && !store.trim().isEmpty()) {
            sql.append(" AND storeID = ?");
            params.add(store);
        }
        
        sql.append("""
            GROUP BY product_name
            ORDER BY total_orders DESC
            LIMIT 5
        """);
        
        return jdbcTemplate.query(sql.toString(), params.toArray(), (rs, rowNum) ->
            new RankingEntry(
                rs.getString("product_name"),
                rs.getInt("total_orders")
            )
        );
    }

    public List<StoreRankingEntry> getStoreRanking(LocalDate start, LocalDate end) {
        String sql = """
            SELECT s.city AS store, COUNT(*) AS orders
            FROM orders o
            JOIN stores s ON o.storeID = s.storeID
            WHERE o.orderDate BETWEEN ? AND ?
            GROUP BY s.city
            ORDER BY orders DESC
            LIMIT 5
        """;
        return jdbcTemplate.query(sql, new Object[]{start, end}, (rs, rowNum) ->
            new StoreRankingEntry(
                rs.getString("store"),
                rs.getInt("orders")
            )
        );
    }

    public List<OrderTimeDTO> getOrderTimes(LocalDate start, LocalDate end, List<String> stores, List<String> categories, List<String> sizes) {
        StringBuilder sql = new StringBuilder(
            "SELECT " +
            "  CASE " +
            "    WHEN HOUR(o.orderDate) BETWEEN 0 AND 5 THEN 'nachts' " +
            "    WHEN HOUR(o.orderDate) BETWEEN 6 AND 11 THEN 'morgens' " +
            "    WHEN HOUR(o.orderDate) BETWEEN 12 AND 14 THEN 'mittags' " +
            "    WHEN HOUR(o.orderDate) BETWEEN 15 AND 17 THEN 'nachmittags' " +
            "    WHEN HOUR(o.orderDate) BETWEEN 18 AND 22 THEN 'abends' " +
            "    ELSE 'spätabends' " +
            "  END AS zeitpunkt, " +
            "  COUNT(*) AS anzahl " +
            "FROM orders o " +
            "LEFT JOIN orderitems oi ON o.orderID = oi.orderID " +
            "LEFT JOIN products p ON oi.productID = p.SKU " +
            "WHERE o.orderDate BETWEEN ? AND ? "
        );
        List<Object> params = new ArrayList<>();
        params.add(start.atStartOfDay());
        params.add(end.plusDays(1).atStartOfDay());
        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (")
               .append(String.join(",", Collections.nCopies(stores.size(), "?")))
               .append(")");
            params.addAll(stores);
        }
        if (categories != null && !categories.isEmpty()) {
            sql.append(" AND p.Category IN (")
               .append(String.join(",", Collections.nCopies(categories.size(), "?")))
               .append(")");
            params.addAll(categories);
        }
        if (sizes != null && !sizes.isEmpty()) {
            sql.append(" AND p.Size IN (")
               .append(String.join(",", Collections.nCopies(sizes.size(), "?")))
               .append(")");
            params.addAll(sizes);
        }
        sql.append(" GROUP BY zeitpunkt");
        sql.append(" ORDER BY FIELD(zeitpunkt, 'nachts', 'morgens', 'mittags', 'nachmittags', 'abends', 'spätabends')");
        return jdbcTemplate.query(
            sql.toString(),
            params.toArray(),
            (rs, rowNum) -> {
                OrderTimeDTO dto = new OrderTimeDTO();
                dto.setZeitpunkt(rs.getString("zeitpunkt"));
                dto.setAnzahl(rs.getLong("anzahl"));
                return dto;
            }
        );
    }
} 