package com.example.pizzadash.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import com.example.pizzadash.dto.OrderTimeDTO;
import com.example.pizzadash.dto.OrdersDTO;
import com.example.pizzadash.dto.RankedProduct;
import com.example.pizzadash.dto.RankingEntry;
import com.example.pizzadash.dto.StoreDTO;
import com.example.pizzadash.dto.StoreRankingEntry;

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

   public Map<String, Object> getKpiSummary(
    LocalDate start, LocalDate end,
    List<String> stores, List<String> categories, List<String> sizes
) {
    StringBuilder sql = new StringBuilder(
        "SELECT " +
        "COUNT(DISTINCT o.orderID) AS totalOrders, " +
        "SUM(o.total) AS revenue, " +
        "SUM(o.nItems) AS totalItems " +
        "FROM orders o " +
        "JOIN orderitems oi ON o.orderID = oi.orderID " +
        "JOIN products p ON oi.productID = p.SKU " +
        "WHERE o.orderDate BETWEEN ? AND ?"
    );

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

    Map<String, Object> result = jdbcTemplate.queryForMap(sql.toString(), params.toArray());
    return result;
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

public List<RankedProduct> compareRankings(List<RankingEntry> previous, List<RankingEntry> current) {
    Map<String, Integer> previousMap = new HashMap<>();
    for (int i = 0; i < previous.size(); i++) {
        previousMap.put(previous.get(i).product, i);
    }

    List<RankedProduct> result = new ArrayList<>();
    for (int i = 0; i < current.size(); i++) {
        RankingEntry item = current.get(i);
        Integer prevIndex = previousMap.get(item.product);

        String trend;
        Integer rankBefore = null;

        if (prevIndex == null) {
            trend = "new";
        } else {
            rankBefore = prevIndex + 1;
            trend = prevIndex > i ? "up" : prevIndex < i ? "down" : "same";
        }

        result.add(new RankedProduct(item.product, item.orders, i + 1, rankBefore, trend));
    }

    return result;
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

public List<StoreDTO> compareStoreRankings(List<StoreRankingEntry> previous, List<StoreRankingEntry> current) {
    Map<String, Integer> previousMap = new HashMap<>();
    for (int i = 0; i < previous.size(); i++) {
        previousMap.put(previous.get(i).store, i);
    }

    List<StoreDTO> result = new ArrayList<>();
    for (int i = 0; i < current.size(); i++) {
        StoreRankingEntry item = current.get(i);
        Integer prevIndex = previousMap.get(item.store);

        String trend;
        Integer rankBefore = null;

        if (prevIndex == null) {
            trend = "new";
        } else {
            rankBefore = prevIndex + 1;
            trend = prevIndex > i ? "up" : prevIndex < i ? "down" : "same";
        }

        result.add(new StoreDTO(item.store, item.orders, i + 1, rankBefore, trend));
    }

    return result;
}




public List<OrderTimeDTO> getOrderTimes(
        LocalDate start, LocalDate end,
        List<String> stores, List<String> categories, List<String> sizes) {

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