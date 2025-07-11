package com.example.pizzadash.repository;

import com.example.pizzadash.dto.RevenueDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Repository
public class RevenueRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<RevenueDTO> getRevenueFiltered(LocalDate start, LocalDate end, List<String> stores, List<String> categories, List<String> sizes) {
        long days = ChronoUnit.DAYS.between(start, end);
        String groupBy = (days <= 31) ? "DATE(o.orderDate)" :
                         (days <= 92) ? "YEARWEEK(o.orderDate)" :
                         "DATE_FORMAT(o.orderDate, '%Y-%m')";
        boolean hasProductFilter = (categories != null && !categories.isEmpty()) || (sizes != null && !sizes.isEmpty());
        StringBuilder sql = new StringBuilder();
        List<Object> params = new java.util.ArrayList<>();
        params.add(start);
        params.add(end);
        if (!hasProductFilter) {
            sql.append("SELECT ").append(groupBy).append(" AS label, SUM(o.total) AS revenue ");
            sql.append("FROM orders o WHERE o.orderDate BETWEEN ? AND ?");
            if (stores != null && !stores.isEmpty()) {
                sql.append(" AND o.storeID IN (")
                   .append(stores.stream().map(s -> "?").reduce((a,b) -> a + "," + b).get())
                   .append(")");
                params.addAll(stores);
            }
        } else {
            sql.append("SELECT ").append(groupBy).append(" AS label, SUM(p.price) AS revenue ");
            sql.append("FROM orders o ");
            sql.append("JOIN orderitems oi ON o.orderID = oi.orderID ");
            sql.append("JOIN products p ON oi.productID = p.SKU ");
            sql.append("WHERE o.orderDate BETWEEN ? AND ?");
            if (stores != null && !stores.isEmpty()) {
                sql.append(" AND o.storeID IN (")
                   .append(stores.stream().map(s -> "?").reduce((a,b) -> a + "," + b).get())
                   .append(")");
                params.addAll(stores);
            }
            if (categories != null && !categories.isEmpty()) {
                sql.append(" AND p.Category IN (")
                   .append(categories.stream().map(c -> "?").reduce((a,b) -> a + "," + b).get())
                   .append(")");
                params.addAll(categories);
            }
            if (sizes != null && !sizes.isEmpty()) {
                sql.append(" AND p.Size IN (")
                   .append(sizes.stream().map(s -> "?").reduce((a,b) -> a + "," + b).get())
                   .append(")");
                params.addAll(sizes);
            }
        }
        sql.append(" GROUP BY label ORDER BY label");
        return jdbcTemplate.query(
            sql.toString(),
            params.toArray(),
            (rs, rowNum) -> new RevenueDTO(
                rs.getString("label"),
                rs.getBigDecimal("revenue")
            )
        );
    }
} 