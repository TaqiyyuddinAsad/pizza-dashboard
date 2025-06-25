package com.example.pizzadash.repository;

import com.example.pizzadash.dto.CustomerCountDTO;
import com.example.pizzadash.dto.RevenuePerCustomerDTO;
import com.example.pizzadash.dto.CategorySalesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AnalyticsRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<CustomerCountDTO> getCustomerCount(String start, String end, String groupBy, List<String> categories, List<String> sizes, List<String> stores) {
        String dateExpr = groupBy != null && groupBy.equalsIgnoreCase("week") ? "YEARWEEK(o.orderDate)" : "DATE_FORMAT(o.orderDate, '%Y-%m')";
        StringBuilder sql = new StringBuilder(
                "SELECT " + dateExpr + " AS period, COUNT(DISTINCT o.customerID) AS totalCustomers " +
                "FROM orders o " +
                "JOIN orderitems oi ON o.orderID = oi.orderID " +
                "JOIN products p ON oi.productID = p.SKU " +
                "WHERE o.orderDate BETWEEN ? AND ? "
        );
        if (categories != null && !categories.isEmpty()) sql.append("AND p.Category IN (").append(toInSql(categories.size())).append(") ");
        if (sizes != null && !sizes.isEmpty()) sql.append("AND p.Size IN (").append(toInSql(sizes.size())).append(") ");
        if (stores != null && !stores.isEmpty()) sql.append("AND o.storeID IN (").append(toInSql(stores.size())).append(") ");
        sql.append("GROUP BY period ORDER BY period");

        Object[] params = buildParams(start, end, categories, sizes, stores);
        return jdbcTemplate.query(sql.toString(), params, (rs, i) ->
                new CustomerCountDTO(rs.getString("period"), rs.getInt("totalCustomers")));
    }

    public List<RevenuePerCustomerDTO> getRevenuePerCustomer(String start, String end, String groupBy, List<String> categories, List<String> sizes, List<String> stores) {
        String dateExpr = groupBy != null && groupBy.equalsIgnoreCase("week") ? "YEARWEEK(o.orderDate)" : "DATE_FORMAT(o.orderDate, '%Y-%m')";
        StringBuilder sql = new StringBuilder(
                "SELECT " + dateExpr + " AS period, SUM(o.total) / COUNT(DISTINCT o.customerID) AS avgRevenuePerCustomer " +
                "FROM orders o " +
                "JOIN orderitems oi ON o.orderID = oi.orderID " +
                "JOIN products p ON oi.productID = p.SKU " +
                "WHERE o.orderDate BETWEEN ? AND ? "
        );
        if (categories != null && !categories.isEmpty()) sql.append("AND p.Category IN (").append(toInSql(categories.size())).append(") ");
        if (sizes != null && !sizes.isEmpty()) sql.append("AND p.Size IN (").append(toInSql(sizes.size())).append(") ");
        if (stores != null && !stores.isEmpty()) sql.append("AND o.storeID IN (").append(toInSql(stores.size())).append(") ");
        sql.append("GROUP BY period ORDER BY period");

        Object[] params = buildParams(start, end, categories, sizes, stores);
        return jdbcTemplate.query(sql.toString(), params, (rs, i) ->
                new RevenuePerCustomerDTO(rs.getString("period"), rs.getDouble("avgRevenuePerCustomer")));
    }

    public List<CategorySalesDTO> getCategorySales(String start, String end, List<String> stores, List<String> sizes) {
        StringBuilder sql = new StringBuilder(
            "SELECT p.Category AS category, COUNT(*) AS quantity, SUM(o.total) AS revenue " +
            "FROM orders o " +
            "JOIN orderitems oi ON o.orderID = oi.orderID " +
            "JOIN products p ON oi.productID = p.SKU " +
            "WHERE o.orderDate BETWEEN ? AND ? "
        );
        java.util.List<Object> params = new java.util.ArrayList<>();
        params.add(start);
        params.add(end);
        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (").append("?,".repeat(stores.size()).replaceAll(",$", "")).append(")");
            params.addAll(stores);
        }
        if (sizes != null && !sizes.isEmpty()) {
            sql.append(" AND p.Size IN (").append("?,".repeat(sizes.size()).replaceAll(",$", "")).append(")");
            params.addAll(sizes);
        }
        sql.append(" GROUP BY p.Category ORDER BY quantity DESC");
        return jdbcTemplate.query(
            sql.toString(),
            params.toArray(),
            (rs, rowNum) -> new com.example.pizzadash.dto.CategorySalesDTO(
                rs.getString("category"),
                rs.getInt("quantity"),
                rs.getDouble("revenue")
            )
        );
    }

    // 1. Best Product Combinations
    public List<com.example.pizzadash.dto.ProductCombinationDTO> getBestCombinations(String start, String end, List<String> stores, int page, int size) {
        StringBuilder sql = new StringBuilder(
            "SELECT CONCAT(p1.Name, ' (', p1.Size, ') + ', p2.Name, ' (', p2.Size, ')') AS combination, COUNT(*) AS orders " +
            "FROM orderitems oi1 " +
            "JOIN orderitems oi2 ON oi1.orderID = oi2.orderID AND oi1.productID < oi2.productID " +
            "JOIN products p1 ON oi1.productID = p1.SKU " +
            "JOIN products p2 ON oi2.productID = p2.SKU " +
            "JOIN orders o ON oi1.orderID = o.orderID " +
            "WHERE o.orderDate BETWEEN ? AND ? "
        );
        java.util.List<Object> params = new java.util.ArrayList<>();
        params.add(start);
        params.add(end);
        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (").append("?,".repeat(stores.size()).replaceAll(",$", "")).append(")");
            params.addAll(stores);
        }
        sql.append(" GROUP BY combination ORDER BY orders DESC LIMIT ? OFFSET ?");
        params.add(size);
        params.add((page - 1) * size);
        return jdbcTemplate.query(
            sql.toString(),
            params.toArray(),
            (rs, rowNum) -> new com.example.pizzadash.dto.ProductCombinationDTO(
                rs.getString("combination"),
                rs.getInt("orders")
            )
        );
    }

    // 2. Product Performance After Launch
    public List<com.example.pizzadash.dto.ProductPerformanceDTO> getPerformanceAfterLaunch(String sku, String start, String end, List<String> stores) {
        StringBuilder sql = new StringBuilder(
            "SELECT YEARWEEK(o.orderDate) - YEARWEEK(p.Launch) + 1 AS week_since_launch, " +
            "SUM(o.total) AS revenue, COUNT(*) AS orders " +
            "FROM orders o " +
            "JOIN orderitems oi ON o.orderID = oi.orderID " +
            "JOIN products p ON oi.productID = p.SKU " +
            "WHERE p.SKU = ? AND o.orderDate >= p.Launch AND o.orderDate BETWEEN ? AND ? "
        );
        java.util.List<Object> params = new java.util.ArrayList<>();
        params.add(sku);
        params.add(start);
        params.add(end);
        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (").append("?,".repeat(stores.size()).replaceAll(",$", "")).append(")");
            params.addAll(stores);
        }
        sql.append(" GROUP BY week_since_launch ORDER BY week_since_launch");
        return jdbcTemplate.query(
            sql.toString(),
            params.toArray(),
            (rs, rowNum) -> new com.example.pizzadash.dto.ProductPerformanceDTO(
                String.valueOf(rs.getInt("week_since_launch")),
                rs.getDouble("revenue"),
                rs.getInt("orders")
            )
        );
    }

    // 3. Pie Chart by Size
    public List<com.example.pizzadash.dto.ProductPieDTO> getPieBySize(String start, String end, List<String> stores) {
        StringBuilder sql = new StringBuilder(
            "SELECT p.Size, COUNT(*) AS orders " +
            "FROM orders o " +
            "JOIN orderitems oi ON o.orderID = oi.orderID " +
            "JOIN products p ON oi.productID = p.SKU " +
            "WHERE o.orderDate BETWEEN ? AND ? "
        );
        java.util.List<Object> params = new java.util.ArrayList<>();
        params.add(start);
        params.add(end);
        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (").append("?,".repeat(stores.size()).replaceAll(",$", "")).append(")");
            params.addAll(stores);
        }
        sql.append(" GROUP BY p.Size");
        return jdbcTemplate.query(
            sql.toString(),
            params.toArray(),
            (rs, rowNum) -> new com.example.pizzadash.dto.ProductPieDTO(
                rs.getString("Size"),
                rs.getInt("orders"),
                0.0
            )
        );
    }

    // Helper methods
    private static String toInSql(int n) { return String.join(",", java.util.Collections.nCopies(n, "?")); }
    private static Object[] buildParams(String start, String end, List<String> categories, List<String> sizes, List<String> stores) {
        java.util.List<Object> out = new java.util.ArrayList<>();
        out.add(start); out.add(end);
        if (categories != null) out.addAll(categories);
        if (sizes != null) out.addAll(sizes);
        if (stores != null) out.addAll(stores);
        return out.toArray();
    }

    public JdbcTemplate getJdbcTemplate() {
        return jdbcTemplate;
    }

    public List<com.example.pizzadash.dto.ProductBestsellerDTO> getBestseller(String start, String end, List<String> stores, List<String> categories, List<String> sizes, int size, int offset) {
        StringBuilder sql = new StringBuilder(
            "SELECT p.SKU, p.name, p.price, p.Size, COUNT(*) AS orders, SUM(o.total) AS revenue " +
            "FROM orders o " +
            "JOIN orderitems oi ON o.orderID = oi.orderID " +
            "JOIN products p ON oi.productID = p.SKU " +
            "WHERE o.orderDate BETWEEN ? AND ? "
        );
        java.util.List<Object> params = new java.util.ArrayList<>();
        params.add(start);
        params.add(end);
        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (").append("?,".repeat(stores.size()).replaceAll(",$", "")).append(")");
            params.addAll(stores);
        }
        if (categories != null && !categories.isEmpty()) {
            sql.append(" AND p.Category IN (").append("?,".repeat(categories.size()).replaceAll(",$", "")).append(")");
            params.addAll(categories);
        }
        if (sizes != null && !sizes.isEmpty()) {
            sql.append(" AND p.Size IN (").append("?,".repeat(sizes.size()).replaceAll(",$", "")).append(")");
            params.addAll(sizes);
        }
        sql.append(" GROUP BY p.SKU, p.name, p.price, p.Size ");
        sql.append(" ORDER BY orders DESC ");
        sql.append(" LIMIT ? OFFSET ?");
        params.add(size);
        params.add(offset);
        return jdbcTemplate.query(
            sql.toString(),
            params.toArray(),
            (rs, rowNum) -> new com.example.pizzadash.dto.ProductBestsellerDTO(
                rs.getString("SKU"),
                rs.getString("name"),
                rs.getDouble("price"),
                rs.getString("Size"),
                rs.getInt("orders"),
                rs.getDouble("revenue")
            )
        );
    }

    public int getBestsellerCount(String start, String end, List<String> stores, List<String> categories, List<String> sizes) {
        StringBuilder sql = new StringBuilder(
            "SELECT COUNT(DISTINCT p.SKU, p.name, p.price, p.Size) AS total " +
            "FROM orders o " +
            "JOIN orderitems oi ON o.orderID = oi.orderID " +
            "JOIN products p ON oi.productID = p.SKU " +
            "WHERE o.orderDate BETWEEN ? AND ? "
        );
        java.util.List<Object> params = new java.util.ArrayList<>();
        params.add(start);
        params.add(end);
        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (").append("?,".repeat(stores.size()).replaceAll(",$", "")).append(")");
            params.addAll(stores);
        }
        if (categories != null && !categories.isEmpty()) {
            sql.append(" AND p.Category IN (").append("?,".repeat(categories.size()).replaceAll(",$", "")).append(")");
            params.addAll(categories);
        }
        if (sizes != null && !sizes.isEmpty()) {
            sql.append(" AND p.Size IN (").append("?,".repeat(sizes.size()).replaceAll(",$", "")).append(")");
            params.addAll(sizes);
        }
        return jdbcTemplate.queryForObject(sql.toString(), params.toArray(), Integer.class);
    }

    public int getCombinationsCount(String start, String end, List<String> stores) {
        StringBuilder sql = new StringBuilder(
            "SELECT COUNT(*) AS total FROM (" +
            "SELECT 1 " +
            "FROM orderitems oi1 " +
            "JOIN orderitems oi2 ON oi1.orderID = oi2.orderID AND oi1.productID < oi2.productID " +
            "JOIN products p1 ON oi1.productID = p1.SKU " +
            "JOIN products p2 ON oi2.productID = p2.SKU " +
            "JOIN orders o ON oi1.orderID = o.orderID " +
            "WHERE o.orderDate BETWEEN ? AND ? "
        );
        java.util.List<Object> params = new java.util.ArrayList<>();
        params.add(start);
        params.add(end);
        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (").append("?,".repeat(stores.size()).replaceAll(",$", "")).append(")");
            params.addAll(stores);
        }
        sql.append(" GROUP BY CONCAT(p1.Name, ' (', p1.Size, ') + ', p2.Name, ' (', p2.Size, ')')) t");
        return jdbcTemplate.queryForObject(sql.toString(), params.toArray(), Integer.class);
    }
}
