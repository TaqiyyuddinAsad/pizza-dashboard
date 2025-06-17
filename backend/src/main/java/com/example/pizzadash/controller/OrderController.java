package com.example.pizzadash.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.pizzadash.service.OrderService;

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
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return orderService.getOrdersGroupedByWeekday(startDate, endDate, stores, categories, sizes);
}
}
