package com.example.pizzadash.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/kpi")
public class KpiController {

    @Autowired
    private JdbcTemplate jdbc;

    @GetMapping
    public Map<String, Object> getKpis(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) List<String> stores,
        @RequestParam(required = false) List<String> categories,
        @RequestParam(required = false) List<String> sizes
    ) {
        StringBuilder sql = new StringBuilder("""
            SELECT 
              COUNT(DISTINCT o.orderID) AS totalOrders,
              SUM(o.total) AS revenue,
              SUM(o.nItems) AS totalItems
            FROM orders o
            JOIN orderitems oi ON o.orderID = oi.orderID
            JOIN products p ON oi.productID = p.SKU
            WHERE o.orderDate BETWEEN ? AND ?
        """);

        List<Object> params = new ArrayList<>();
        params.add(start);
        params.add(end);

        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (")
               .append("?,".repeat(stores.size()).replaceAll(",$", ""))
               .append(")");
            params.addAll(stores);
        }

        if (categories != null && !categories.isEmpty()) {
            sql.append(" AND p.Category IN (")
               .append("?,".repeat(categories.size()).replaceAll(",$", ""))
               .append(")");
            params.addAll(categories);
        }

        if (sizes != null && !sizes.isEmpty()) {
            sql.append(" AND p.Size IN (")
               .append("?,".repeat(sizes.size()).replaceAll(",$", ""))
               .append(")");
            params.addAll(sizes);
        }

        Map<String, Object> row = jdbc.queryForMap(sql.toString(), params.toArray());

        double revenue = row.get("revenue") != null ? ((Number) row.get("revenue")).doubleValue() : 0;
        int totalOrders = row.get("totalOrders") != null ? ((Number) row.get("totalOrders")).intValue() : 0;
        int totalItems = row.get("totalItems") != null ? ((Number) row.get("totalItems")).intValue() : 0;
        double avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("Revenue", revenue);
        result.put("Avg Order Value", avgOrderValue);
        result.put("Total Orders", totalOrders);
        result.put("Total Items", totalItems);

        return result;
    }
}
