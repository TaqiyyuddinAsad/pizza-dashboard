package com.example.pizzadash.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.LinkedHashMap;

@RestController
@RequestMapping("/kpi")
public class KpiController {

    @Autowired
    private JdbcTemplate jdbc;

    @GetMapping
    public Map<String, Object> getKpis(
        @RequestParam String start,
        @RequestParam String end
    ) {
        String query = "SELECT total, nItems FROM orders WHERE orderDate BETWEEN ? AND ?";
        List<Map<String, Object>> rows = jdbc.queryForList(query, start, end);

        double revenue = 0;
        int count = rows.size();
        int items = 0;

        for (Map<String, Object> row : rows) {
            revenue += ((Number) row.get("total")).doubleValue();
            items += ((Number) row.get("nItems")).intValue();
        }

        double avg = count == 0 ? 0 : revenue / count;

        Map<String, Object> result = new HashMap<>();
        result.put("Revenue", revenue);
        result.put("Avg Order Value", avg);
        result.put("Total Orders", count);
        result.put("Total Items", items);
        return result;
    }
}


