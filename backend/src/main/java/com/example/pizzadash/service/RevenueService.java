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
    System.out.println("🔍 RevenueService called with:");
    System.out.println("  Start: " + start);
    System.out.println("  End: " + end);
    System.out.println("  Stores: " + stores);
    System.out.println("  Categories: " + categories);
    System.out.println("  Sizes: " + sizes);
    
    long days = ChronoUnit.DAYS.between(start, end);
    String groupBy = (days <= 31) ? "DATE(o.orderDate)" :
                     (days <= 92) ? "YEARWEEK(o.orderDate)" :
                     "DATE_FORMAT(o.orderDate, '%Y-%m')";

    boolean hasProductFilter = (categories != null && !categories.isEmpty()) || (sizes != null && !sizes.isEmpty());
    System.out.println("🔍 Has product filter: " + hasProductFilter);

    StringBuilder sql = new StringBuilder();
    List<Object> params = new java.util.ArrayList<>();
    params.add(start);
    params.add(end);

    if (!hasProductFilter) {
      // Ohne Produktfilter: direkt orders.total summieren
      sql.append("SELECT ").append(groupBy).append(" AS label, SUM(o.total) AS revenue ");
      sql.append("FROM orders o WHERE o.orderDate BETWEEN ? AND ?");
      if (stores != null && !stores.isEmpty()) {
        sql.append(" AND o.storeID IN (")
           .append(stores.stream().map(s -> "?").reduce((a,b) -> a + "," + b).get())
           .append(")");
        params.addAll(stores);
      }
    } else {
      // Mit Produktfilter: Summe der Produktpreise aus passenden orderitems
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

    System.out.println("🔍 Generated SQL: " + sql.toString());
    System.out.println("🔍 SQL Parameters: " + params);

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
