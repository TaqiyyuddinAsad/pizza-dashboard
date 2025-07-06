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
        System.out.println("🎯 KPI Controller called!");
        System.out.println("  Start: " + start);
        System.out.println("  End: " + end);
        System.out.println("  Stores: " + stores);
        System.out.println("  Categories: " + categories);
        System.out.println("  Sizes: " + sizes);
        
       LocalDate startDate = LocalDate.parse(start.trim());
       LocalDate endDate = LocalDate.parse(end.trim());
        List<String> storeList = split(stores);
        List<String> categoryList = split(categories);
        List<String> sizeList = split(sizes);

        Map<String, Object> result = orderService.getKpiSummary(startDate, endDate, storeList, categoryList, sizeList);
        System.out.println("🎯 KPI Controller returning result: " + result);
        return result;
    }

    private List<String> split(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptyList();
        return Arrays.stream(raw.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }
}
