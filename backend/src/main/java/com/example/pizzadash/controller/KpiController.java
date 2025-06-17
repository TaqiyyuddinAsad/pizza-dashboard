package com.example.pizzadash.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.pizzadash.service.OrderService;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/kpi")
public class KpiController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public Map<String, Object> getKpis(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) String stores,
        @RequestParam(required = false) String categories,
        @RequestParam(required = false) String sizes
    ) {
       LocalDate startDate = LocalDate.parse(start.trim());
       LocalDate endDate = LocalDate.parse(end.trim());
        List<String> storeList = split(stores);
        List<String> categoryList = split(categories);
        List<String> sizeList = split(sizes);

        Map<String, Object> row = orderService.getKpiSummary(startDate, endDate, storeList, categoryList, sizeList);

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

    private List<String> split(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptyList();
        return Arrays.stream(raw.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }
}
