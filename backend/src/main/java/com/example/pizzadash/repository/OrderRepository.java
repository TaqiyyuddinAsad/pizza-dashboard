package com.example.pizzadash.repository;

import com.example.pizzadash.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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
            sql.append(" AND o.storeID IN (").append("?,".repeat(stores.size()).replaceAll(", $", "")).append(")");
            params.addAll(stores);
        }
        if (categories != null && !categories.isEmpty()) {
            sql.append(" AND p.Category IN (").append("?,".repeat(categories.size()).replaceAll(", $", "")).append(")");
            params.addAll(categories);
        }
        if (sizes != null && !sizes.isEmpty()) {
            sql.append(" AND p.Size IN (").append("?,".repeat(sizes.size()).replaceAll(", $", "")).append(")");
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
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();
        params.add(start);
        params.add(end);
        if (!hasProductFilter) {
            sql.append("SELECT COUNT(DISTINCT o.orderID) AS totalOrders, SUM(o.total) AS revenue, SUM(o.nItems) AS totalItems FROM orders o WHERE o.orderDate BETWEEN ? AND ?");
            if (stores != null && !stores.isEmpty()) {
                sql.append(" AND o.storeID IN (").append("?,".repeat(stores.size()).replaceAll(", $", "")).append(")");
                params.addAll(stores);
            }
        } else {
            sql.append("SELECT COUNT(DISTINCT o.orderID) AS totalOrders, SUM(p.price) AS revenue, SUM(oi.quantity) AS totalItems FROM orders o ");
            sql.append("JOIN orderitems oi ON o.orderID = oi.orderID ");
            sql.append("JOIN products p ON oi.productID = p.SKU ");
            sql.append("WHERE o.orderDate BETWEEN ? AND ?");
            if (stores != null && !stores.isEmpty()) {
                sql.append(" AND o.storeID IN (").append("?,".repeat(stores.size()).replaceAll(", $", "")).append(")");
                params.addAll(stores);
            }
            if (categories != null && !categories.isEmpty()) {
                sql.append(" AND p.Category IN (").append("?,".repeat(categories.size()).replaceAll(", $", "")).append(")");
                params.addAll(categories);
            }
            if (sizes != null && !sizes.isEmpty()) {
                sql.append(" AND p.Size IN (").append("?,".repeat(sizes.size()).replaceAll(", $", "")).append(")");
                params.addAll(sizes);
            }
        }
        Map<String, Object> result = jdbcTemplate.queryForMap(sql.toString(), params.toArray());
        // 1. Average days between first and second order
        Double avgDaysBetweenOrders = 0.0;
        try {
            avgDaysBetweenOrders = jdbcTemplate.queryForObject(
                "SELECT AVG(diff) FROM (\n" +
                "  SELECT DATEDIFF(MIN(CASE WHEN rn=2 THEN orderDate END), MIN(CASE WHEN rn=1 THEN orderDate END)) AS diff\n" +
                "  FROM (\n" +
                "    SELECT customerID, orderDate, ROW_NUMBER() OVER (PARTITION BY customerID ORDER BY orderDate) rn\n" +
                "    FROM orders\n" +
                "    WHERE orderDate BETWEEN ? AND ?\n" +
                "  ) t\n" +
                "  WHERE rn IN (1,2)\n" +
                "  GROUP BY customerID\n" +
                "  HAVING COUNT(*) > 1\n" +
                ") x",
                Double.class, start, end
            );
            if (avgDaysBetweenOrders == null) avgDaysBetweenOrders = 0.0;
        } catch (Exception e) { avgDaysBetweenOrders = 0.0; }
        result.put("AvgDaysBetweenOrders", avgDaysBetweenOrders);
        // 2. Average delivery distance (Haversine formula)
        Double avgDeliveryDistance = 0.0;
        try {
            avgDeliveryDistance = jdbcTemplate.queryForObject(
                "SELECT AVG(\n" +
                "  6371 * 2 * ASIN(SQRT(\n" +
                "    POWER(SIN(RADIANS((c.latitude - s.latitude)/2)),2) +\n" +
                "    COS(RADIANS(s.latitude)) * COS(RADIANS(c.latitude)) *\n" +
                "    POWER(SIN(RADIANS((c.longitude - s.longitude)/2)),2)\n" +
                "  ))\n" +
                ") AS distance\n" +
                "FROM orders o\n" +
                "JOIN customers c ON o.customerID = c.customerID\n" +
                "JOIN stores s ON o.storeID = s.storeID\n" +
                "WHERE o.orderDate BETWEEN ? AND ?",
                Double.class, start, end
            );
            if (avgDeliveryDistance == null) avgDeliveryDistance = 0.0;
        } catch (Exception e) { avgDeliveryDistance = 0.0; }
        result.put("AvgDeliveryDistance", avgDeliveryDistance);
        // 3. Repeat order share: percentage of orders from repeat customers
        Double repeatOrderShare = 0.0;
        try {
            repeatOrderShare = jdbcTemplate.queryForObject(
                "SELECT 100.0 * SUM(CASE WHEN c.order_count > 1 THEN c.o_count ELSE 0 END) / NULLIF(SUM(c.o_count),0)\n" +
                "FROM (\n" +
                "  SELECT customerID, COUNT(*) AS o_count\n" +
                "  FROM orders\n" +
                "  WHERE orderDate BETWEEN ? AND ?\n" +
                "  GROUP BY customerID\n" +
                ") c\n",
                Double.class, start, end
            );
            if (repeatOrderShare == null) repeatOrderShare = 0.0;
        } catch (Exception e) { repeatOrderShare = 0.0; }
        result.put("RepeatRate", repeatOrderShare);
        // Defensive: ensure all expected keys are present
        if (!result.containsKey("Avg Order Value")) result.put("Avg Order Value", 0.0);
        if (!result.containsKey("Total Orders")) result.put("Total Orders", 0);
        if (!result.containsKey("Total Items")) result.put("Total Items", 0);
        if (!result.containsKey("Revenue")) result.put("Revenue", 0.0);
        // Build result map with frontend-expected keys
        Map<String, Object> frontendResult = new HashMap<>();
        frontendResult.put("Revenue", result.getOrDefault("revenue", 0.0));
        frontendResult.put("Avg Order Value", result.getOrDefault("Avg Order Value", 0.0));
        frontendResult.put("Total Orders", result.getOrDefault("totalOrders", 0));
        frontendResult.put("Total Items", result.getOrDefault("totalItems", 0));
        frontendResult.put("AvgDaysBetweenOrders", result.getOrDefault("AvgDaysBetweenOrders", 0.0));
        frontendResult.put("AvgDeliveryDistance", result.getOrDefault("AvgDeliveryDistance", 0.0));
        frontendResult.put("RepeatRate", result.getOrDefault("RepeatRate", 0.0));
        return frontendResult;
    }

    public List<RankingEntry> getProductRanking(LocalDate start, LocalDate end) {
        String sql = """
            SELECT product, SUM(orders) AS total_orders
            FROM product_orders_daily
            WHERE day BETWEEN ? AND ?
            GROUP BY product
            ORDER BY total_orders DESC
            LIMIT 5
        """;
        return jdbcTemplate.query(sql, new Object[]{start, end}, (rs, rowNum) ->
            new RankingEntry(
                rs.getString("product"),
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