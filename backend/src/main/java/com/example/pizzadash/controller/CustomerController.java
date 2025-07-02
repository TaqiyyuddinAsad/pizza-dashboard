package com.example.pizzadash.controller;

import com.example.pizzadash.dto.CustomerCountDTO;
import com.example.pizzadash.dto.RevenuePerCustomerDTO;
import com.example.pizzadash.dto.InactiveCustomerDTO;
import com.example.pizzadash.dto.RevenueSegmentDTO;
import com.example.pizzadash.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class CustomerController {

    @Autowired
    private CustomerService analyticsService;

    @GetMapping("/customer-count")
    public List<CustomerCountDTO> getCustomerCount(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) String groupBy,
        @RequestParam(required = false) List<String> categories,
        @RequestParam(required = false) List<String> sizes,
        @RequestParam(required = false) List<String> stores
    ) {
        return analyticsService.getCustomerCount(start, end, groupBy, categories, sizes, stores);
    }

    @GetMapping("/revenue-per-customer")
    public List<RevenuePerCustomerDTO> getRevenuePerCustomer(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) String groupBy,
        @RequestParam(required = false) List<String> categories,
        @RequestParam(required = false) List<String> sizes,
        @RequestParam(required = false) List<String> stores
    ) {
        return analyticsService.getRevenuePerCustomer(start, end, groupBy, categories, sizes, stores);
    }

    @GetMapping("/inactive-customers")
    public List<InactiveCustomerDTO> getInactiveCustomers(
        @RequestParam(required = false) String reference
    ) {
        return analyticsService.getInactiveCustomers(30, reference);
    }

    @GetMapping("/revenue-per-customer-segments")
    public List<RevenueSegmentDTO> getRevenuePerCustomerSegments(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) List<String> categories,
        @RequestParam(required = false) List<String> sizes,
        @RequestParam(required = false) List<String> stores
    ) {
        return analyticsService.getRevenuePerCustomerSegments(start, end, categories, sizes, stores);
    }
}
