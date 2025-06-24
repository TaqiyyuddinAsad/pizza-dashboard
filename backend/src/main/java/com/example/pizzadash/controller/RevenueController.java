package com.example.pizzadash.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.pizzadash.service.RevenueService;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.pizzadash.dto.RevenueDTO;


@RestController
@RequestMapping("/revenue")
public class RevenueController {

    @Autowired
    private RevenueService revenueService;


@GetMapping
public List<RevenueDTO> getRevenue(
    @RequestParam String start,
    @RequestParam String end,
    @RequestParam(required = false) List<String> stores,
    @RequestParam(required = false) List<String> categories,
    @RequestParam(required = false) List<String> sizes
) {
    System.out.println("💰 Revenue Request:");
    System.out.println("  Start: " + start);
    System.out.println("  End: " + end);
    System.out.println("  Stores: " + stores);
    System.out.println("  Categories: " + categories);
    System.out.println("  Sizes: " + sizes);
    
    LocalDate startDate = LocalDate.parse(start);
    LocalDate endDate = LocalDate.parse(end);
    return revenueService.getRevenueFiltered(startDate, endDate, stores, categories, sizes);
}

}

