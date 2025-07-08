package com.example.pizzadash.repository;

import com.example.pizzadash.dto.CustomerCountDTO;
import com.example.pizzadash.dto.RevenuePerCustomerDTO;
import com.example.pizzadash.dto.CategorySalesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Repository
public class AnalyticsRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<CustomerCountDTO> getCustomerCount(String start, String end, String groupBy, List<String> categories, List<String> sizes, List<String> stores) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        long months = ChronoUnit.MONTHS.between(startDate.withDayOfMonth(1), endDate.withDayOfMonth(1)) + 1;
        long years = ChronoUnit.YEARS.between(startDate.withDayOfYear(1), endDate.withDayOfYear(1)) + 1;
        String periodExpr;
        if (days <= 31) {
            periodExpr = "DATE(orderDate)";
        } else if (years <= 2) {
            periodExpr = "DATE_FORMAT(orderDate, '%Y-%m')";
        } else {
            periodExpr = "YEAR(orderDate)";
        }
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ").append(periodExpr).append(" AS period, COUNT(DISTINCT customerID) AS totalCustomers FROM orders WHERE orderDate BETWEEN ? AND ? ");
        if (stores != null && !stores.isEmpty()) {
            sql.append("AND storeID IN (").append(toInSql(stores.size())).append(") ");
        }
        sql.append("GROUP BY period ORDER BY period");
        Object[] params = buildParams(start, end, null, null, stores);
        return jdbcTemplate.query(sql.toString(), params, (rs, i) ->
                new CustomerCountDTO(rs.getString("period"), rs.getInt("totalCustomers")));
    }

    public List<RevenuePerCustomerDTO> getRevenuePerCustomer(String start, String end, String groupBy, List<String> categories, List<String> sizes, List<String> stores) {
        if ((categories != null && !categories.isEmpty()) || (sizes != null && !sizes.isEmpty())) {
            throw new UnsupportedOperationException("Category/size filters not supported with materialized customer_kpi_daily table");
        }
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        long months = ChronoUnit.MONTHS.between(startDate.withDayOfMonth(1), endDate.withDayOfMonth(1)) + 1;
        long years = ChronoUnit.YEARS.between(startDate.withDayOfYear(1), endDate.withDayOfYear(1)) + 1;
        String periodExpr;
        if (days <= 31) {
            periodExpr = "DATE(day)";
        } else if (years <= 2) {
            periodExpr = "DATE_FORMAT(day, '%Y-%m')";
        } else {
            periodExpr = "YEAR(day)";
        }
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ").append(periodExpr).append(" AS period, AVG(avg_revenue_per_customer) AS avgRevenuePerCustomer FROM customer_kpi_daily WHERE day BETWEEN ? AND ? ");
        if (stores != null && !stores.isEmpty()) {
            sql.append("AND storeID IN (").append(toInSql(stores.size())).append(") ");
        }
        sql.append("GROUP BY period ORDER BY period");
        Object[] params = buildParams(start, end, null, null, stores);
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
            sql.append(" AND o.storeID IN (")
               .append(String.join(",", java.util.Collections.nCopies(stores.size(), "?")))
               .append(")");
            params.addAll(stores);
        }
        if (sizes != null && !sizes.isEmpty()) {
            sql.append(" AND p.Size IN (")
               .append(String.join(",", java.util.Collections.nCopies(sizes.size(), "?")))
               .append(")");
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
            sql.append(" AND o.storeID IN (")
               .append(String.join(",", java.util.Collections.nCopies(stores.size(), "?")))
               .append(")");
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
            sql.append(" AND o.storeID IN (")
               .append(String.join(",", java.util.Collections.nCopies(stores.size(), "?")))
               .append(")");
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
            sql.append(" AND o.storeID IN (")
               .append(String.join(",", java.util.Collections.nCopies(stores.size(), "?")))
               .append(")");
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
            sql.append(" AND o.storeID IN (")
               .append(String.join(",", java.util.Collections.nCopies(stores.size(), "?")))
               .append(")");
            params.addAll(stores);
        }
        if (categories != null && !categories.isEmpty()) {
            sql.append(" AND p.Category IN (")
               .append(String.join(",", java.util.Collections.nCopies(categories.size(), "?")))
               .append(")");
            params.addAll(categories);
        }
        if (sizes != null && !sizes.isEmpty()) {
            sql.append(" AND p.Size IN (")
               .append(String.join(",", java.util.Collections.nCopies(sizes.size(), "?")))
               .append(")");
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
            sql.append(" AND o.storeID IN (")
               .append(String.join(",", java.util.Collections.nCopies(stores.size(), "?")))
               .append(")");
            params.addAll(stores);
        }
        if (categories != null && !categories.isEmpty()) {
            sql.append(" AND p.Category IN (")
               .append(String.join(",", java.util.Collections.nCopies(categories.size(), "?")))
               .append(")");
            params.addAll(categories);
        }
        if (sizes != null && !sizes.isEmpty()) {
            sql.append(" AND p.Size IN (")
               .append(String.join(",", java.util.Collections.nCopies(sizes.size(), "?")))
               .append(")");
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
            sql.append(" AND o.storeID IN (")
               .append(String.join(",", java.util.Collections.nCopies(stores.size(), "?")))
               .append(")");
            params.addAll(stores);
        }
        sql.append(" GROUP BY CONCAT(p1.Name, ' (', p1.Size, ') + ', p2.Name, ' (', p2.Size, ')')) t");
        return jdbcTemplate.queryForObject(sql.toString(), params.toArray(), Integer.class);
    }

    public List<com.example.pizzadash.dto.InactiveCustomerDTO> getInactiveCustomers(int days, String reference) {
        String refDate = (reference != null && !reference.isEmpty()) ? reference : java.time.LocalDate.now().toString();
        String sql = "SELECT c.customerID, MAX(o.orderDate) AS lastOrder, DATEDIFF(?, MAX(o.orderDate)) AS inactiveDays " +
                "FROM customers c " +
                "LEFT JOIN orders o ON c.customerID = o.customerID " +
                "GROUP BY c.customerID " +
                "HAVING inactiveDays >= ? " +
                "ORDER BY inactiveDays DESC";
        return jdbcTemplate.query(sql, new Object[]{refDate, days}, (rs, i) ->
                new com.example.pizzadash.dto.InactiveCustomerDTO(
                        rs.getString("customerID"),
                        rs.getDate("lastOrder"),
                        rs.getInt("inactiveDays")
                )
        );
    }

    public List<com.example.pizzadash.dto.RevenueSegmentDTO> getRevenuePerCustomerSegments(String start, String end, List<String> categories, List<String> sizes, List<String> stores) {
        StringBuilder sql = new StringBuilder(
            "SELECT o.customerID, SUM(o.total) AS totalRevenue " +
            "FROM orders o " +
            "JOIN orderitems oi ON o.orderID = oi.orderID " +
            "JOIN products p ON oi.productID = p.SKU " +
            "WHERE o.orderDate BETWEEN ? AND ? "
        );
        if (categories != null && !categories.isEmpty()) sql.append("AND p.Category IN (").append(toInSql(categories.size())).append(") ");
        if (sizes != null && !sizes.isEmpty()) sql.append("AND p.Size IN (").append(toInSql(sizes.size())).append(") ");
        if (stores != null && !stores.isEmpty()) sql.append("AND o.storeID IN (").append(toInSql(stores.size())).append(") ");
        sql.append("GROUP BY o.customerID");
        Object[] params = buildParams(start, end, categories, sizes, stores);
        List<Double> revenues = jdbcTemplate.query(sql.toString(), params, (rs, i) -> rs.getDouble("totalRevenue"));
        int seg1 = 0, seg2 = 0, seg3 = 0;
        for (double r : revenues) {
            if (r <= 15) seg1++;
            else if (r <= 50) seg2++;
            else seg3++;
        }
        List<com.example.pizzadash.dto.RevenueSegmentDTO> result = new java.util.ArrayList<>();
        result.add(new com.example.pizzadash.dto.RevenueSegmentDTO("≤15$", seg1));
        result.add(new com.example.pizzadash.dto.RevenueSegmentDTO("15$–50$", seg2));
        result.add(new com.example.pizzadash.dto.RevenueSegmentDTO(">50$", seg3));
        return result;
    }

    public List<com.example.pizzadash.dto.ProductBestsellerDTO> getProductsByFlexibleFilter(
            String start, String end, 
            String productNamePattern, 
            String size, 
            List<String> stores, 
            List<String> categories) {
        
        StringBuilder sql = new StringBuilder(
            "SELECT p.SKU, p.Name, p.Price, p.Size, COUNT(*) AS orders, SUM(p.Price) AS revenue " +
            "FROM orders o " +
            "JOIN orderitems oi ON o.orderID = oi.orderID " +
            "JOIN products p ON oi.productID = p.SKU " +
            "WHERE o.orderDate BETWEEN ? AND ? "
        );
        
        List<Object> params = new ArrayList<>();
        params.add(start);
        params.add(end);
        
        // Add product name filter (flexible matching)
        if (productNamePattern != null && !productNamePattern.trim().isEmpty()) {
            sql.append(" AND (p.Name LIKE ? OR p.Name LIKE ? OR p.Name LIKE ?) ");
            params.add("%" + productNamePattern.toLowerCase() + "%");
            params.add("%" + productNamePattern.toUpperCase() + "%");
            params.add("%" + productNamePattern + "%");
        }
        
        // Add size filter (flexible matching)
        if (size != null && !size.trim().isEmpty()) {
            sql.append(" AND (p.Size = ? OR p.Size = ? OR p.Size = ?) ");
            params.add(size.toLowerCase());
            params.add(size.toUpperCase());
            params.add(size);
        }
        
        // Add store filter
        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (")
               .append(String.join(",", Collections.nCopies(stores.size(), "?")))
               .append(")");
            params.addAll(stores);
        }
        
        // Add category filter
        if (categories != null && !categories.isEmpty()) {
            sql.append(" AND p.Category IN (")
               .append(String.join(",", Collections.nCopies(categories.size(), "?")))
               .append(")");
            params.addAll(categories);
        }
        
        sql.append(" GROUP BY p.SKU, p.Name, p.Price, p.Size ");
        sql.append(" ORDER BY orders DESC ");
        
        return jdbcTemplate.query(
            sql.toString(),
            params.toArray(),
            (rs, rowNum) -> new com.example.pizzadash.dto.ProductBestsellerDTO(
                rs.getString("SKU"),
                rs.getString("Name"),
                rs.getDouble("Price"),
                rs.getString("Size"),
                rs.getInt("orders"),
                rs.getDouble("revenue")
            )
        );
    }

    public List<Map<String, Object>> getProductSearchResults(
            String start, String end, 
            String searchTerm, 
            List<String> stores) {
        
        StringBuilder sql = new StringBuilder(
            "SELECT p.SKU, p.Name, p.Size, p.Category, p.Price, " +
            "COUNT(*) AS order_count, SUM(p.Price) AS total_revenue " +
            "FROM orders o " +
            "JOIN orderitems oi ON o.orderID = oi.orderID " +
            "JOIN products p ON oi.productID = p.SKU " +
            "WHERE o.orderDate BETWEEN ? AND ? "
        );
        
        List<Object> params = new ArrayList<>();
        params.add(start);
        params.add(end);
        
        // Flexible search across product name, category, and size
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            sql.append(" AND (p.Name LIKE ? OR p.Category LIKE ? OR p.Size LIKE ?) ");
            String searchPattern = "%" + searchTerm + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }
        
        // Add store filter
        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (")
               .append(String.join(",", Collections.nCopies(stores.size(), "?")))
               .append(")");
            params.addAll(stores);
        }
        
        sql.append(" GROUP BY p.SKU, p.Name, p.Size, p.Category, p.Price ");
        sql.append(" ORDER BY order_count DESC ");
        
        return jdbcTemplate.query(
            sql.toString(),
            params.toArray(),
            (rs, rowNum) -> {
                Map<String, Object> result = new HashMap<>();
                result.put("sku", rs.getString("SKU"));
                result.put("name", rs.getString("Name"));
                result.put("size", rs.getString("Size"));
                result.put("category", rs.getString("Category"));
                result.put("price", rs.getDouble("Price"));
                result.put("orderCount", rs.getInt("order_count"));
                result.put("totalRevenue", rs.getDouble("total_revenue"));
                return result;
            }
        );
    }
}
