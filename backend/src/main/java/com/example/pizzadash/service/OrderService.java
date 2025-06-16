package com.example.pizzadash.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;


import com.example.pizzadash.dto.OrdersDTO;

@Service
public class OrderService {

    @Autowired
    JdbcTemplate jdbcTemplate;
    public List<OrdersDTO> getOrdersGroupedByWeekday(LocalDate start, LocalDate end,
    List<String> stores, List<String> categories, List<String> sizes) {
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
}
