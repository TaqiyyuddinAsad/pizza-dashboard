package com.example.pizzadash.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import com.example.pizzadash.dto.RevenueDTO;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class RevenueService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

  public List<RevenueDTO> getRevenueFiltered(LocalDate start, LocalDate end, List<String> stores, List<String> categories, List<String> sizes) {
    long days = ChronoUnit.DAYS.between(start, end);
    String groupBy = (days <= 31) ? "DATE(o.orderDate)" :
                     (days <= 92) ? "YEARWEEK(o.orderDate)" :
                     "DATE_FORMAT(o.orderDate, '%Y-%m')";

    StringBuilder sql = new StringBuilder("""
        SELECT %s AS label, SUM(o.total) AS revenue
        FROM orders o
        JOIN orderitems oi ON o.orderID = oi.orderID
        JOIN products p ON oi.productID = p.SKU
        WHERE o.orderDate BETWEEN ? AND ?
        """.formatted(groupBy));

    if (stores != null && !stores.isEmpty()) {
        sql.append(" AND o.storeID IN (%s)".formatted(stores.stream().map(s -> "?").reduce((a,b) -> a + "," + b).get()));
    }
    if (categories != null && !categories.isEmpty()) {
        sql.append(" AND p.Category IN (%s)".formatted(categories.stream().map(c -> "?").reduce((a,b) -> a + "," + b).get()));
    }
    if (sizes != null && !sizes.isEmpty()) {
        sql.append(" AND p.Size IN (%s)".formatted(sizes.stream().map(s -> "?").reduce((a,b) -> a + "," + b).get()));
    }

    sql.append(" GROUP BY label ORDER BY label");

    // Parameterliste vorbereiten
    List<Object> params = new java.util.ArrayList<>();
    params.add(start);
    params.add(end);
    if (stores != null) params.addAll(stores);
    if (categories != null) params.addAll(categories);
    if (sizes != null) params.addAll(sizes);

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
