package com.example.pizzadash.controller;

import java.time.LocalDate;

import java.util.Arrays;
import java.util.List;
import java.util.Collections;

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
        @RequestParam(required = false) String stores,
        @RequestParam(required = false) String categories,
        @RequestParam(required = false) String sizes
    ) {
        LocalDate startDate = LocalDate.parse(start.trim());
        LocalDate endDate = LocalDate.parse(end.trim());
        List<String> storesList = splitCsv(stores);
        List<String> categoriesList = splitCsv(categories);
        List<String> sizesList = splitCsv(sizes);

        return orderService.getOrdersGroupedByWeekday(startDate, endDate, storesList, categoriesList, sizesList);
    }

    @GetMapping("/orders/times")
    public List<OrderTimeDTO> getOrderTimes(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) String stores,
        @RequestParam(required = false) String categories,
        @RequestParam(required = false) String sizes
    ) {
        LocalDate startDate = LocalDate.parse(start.trim());
        LocalDate endDate = LocalDate.parse(end.trim());
        List<String> storesList = splitCsv(stores);
        List<String> categoriesList = splitCsv(categories);
        List<String> sizesList = splitCsv(sizes);

        return orderService.getOrderTimes(startDate, endDate, storesList, categoriesList, sizesList);
    }

    private List<String> splitCsv(String csv) {
        if (csv == null || csv.isBlank()) return Collections.emptyList();
        return Arrays.stream(csv.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }


}
