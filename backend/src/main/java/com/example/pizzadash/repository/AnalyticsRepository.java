package com.example.pizzadash.repository;

import com.example.pizzadash.dto.CustomerCountDTO;
import com.example.pizzadash.dto.RevenuePerCustomerDTO;
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
}
