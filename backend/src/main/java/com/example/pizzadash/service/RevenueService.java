package com.example.pizzadash.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import com.example.pizzadash.dto.RevenueDTO;
import java.util.List;

@Service
public class RevenueService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<RevenueDTO> getMonthlyRevenue() {
        String sql = """
            SELECT DATE_FORMAT(o.orderDate, '%Y-%m') AS month,
                   SUM(p.Price) AS revenue
            FROM orders o
            JOIN orderitems oi ON o.orderID = oi.orderID
            JOIN products p ON p.SKU = oi.productID
            GROUP BY month
            ORDER BY month
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
            new RevenueDTO(
                rs.getString("month"),
                rs.getBigDecimal("revenue")
            )
        );
    }
}
