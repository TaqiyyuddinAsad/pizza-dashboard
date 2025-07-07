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
        List<String> storeList = splitCsv(stores);
        List<String> categoryList = splitCsv(categories);
        List<String> sizeList = splitCsv(sizes);

        try {
            Map<String, Object> result = orderService.getKpiSummary(startDate, endDate, storeList, categoryList, sizeList);
            if (result == null) {
                result = new HashMap<>();
            }
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("error", e.getMessage());
            return errorResult;
        }
    }

    private List<String> splitCsv(String csv) {
        if (csv == null || csv.isBlank()) return Collections.emptyList();
        return Arrays.stream(csv.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }
}
