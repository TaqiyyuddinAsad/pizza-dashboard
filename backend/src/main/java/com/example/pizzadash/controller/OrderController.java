package com.example.pizzadash.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.pizzadash.service.OrderService;
import com.example.pizzadash.dto.OrderTimeDTO;
import com.example.pizzadash.dto.OrdersDTO;

@RestController
public class OrderController {

    @Autowired 
    private OrderService orderService;

    @GetMapping("/orders/chart")
    public List<OrdersDTO> getOrdersByWeekday(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) List<String> stores,
        @RequestParam(required = false) List<String> categories,
        @RequestParam(required = false) List<String> sizes
) {
        System.out.println("📊 Orders Chart Request:");
        System.out.println("  Start: " + start);
        System.out.println("  End: " + end);
        System.out.println("  Stores: " + stores);
        System.out.println("  Categories: " + categories);
        System.out.println("  Sizes: " + sizes);
        
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return orderService.getOrdersGroupedByWeekday(startDate, endDate, stores, categories, sizes);
}

@GetMapping("/orders/times")
public List<OrderTimeDTO> getOrderTimes(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) String stores,
        @RequestParam(required = false) String categories,
        @RequestParam(required = false) String sizes) {

    return orderService.getOrderTimes(
        LocalDate.parse(start != null ? start.trim() : ""),
        LocalDate.parse(end != null ? end.trim() : ""),
        splitCsv(stores),
        splitCsv(categories),
        splitCsv(sizes)
    );
}

// Hilfsmethode für Komma-getrennte Strings zu Listen:
private List<String> splitCsv(String csv) {
    if (csv == null || csv.isEmpty()) {
        return new ArrayList<>();
    }
    return Arrays.asList(csv.split(","));
}


}
