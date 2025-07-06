package com.example.pizzadash.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.pizzadash.service.RevenueService;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestHeader;

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
    @RequestParam(required = false) String categories,
    @RequestParam(required = false) String sizes,
    @RequestHeader Map<String, String> headers
) {
   

    LocalDate startDate = LocalDate.parse(start);
    LocalDate endDate = LocalDate.parse(end);
    List<String> categoryList = splitCsv(categories);
    List<String> sizeList = splitCsv(sizes);
    try {
        return revenueService.getRevenueFiltered(startDate, endDate, stores, categoryList, sizeList);
    } catch (Exception e) {
        System.err.println("[RevenueController] Exception: " + e.getClass().getName() + ": " + e.getMessage());
        e.printStackTrace();
        throw e;
    }
}

private List<String> splitCsv(String csv) {
    if (csv == null || csv.isEmpty()) {
        return new java.util.ArrayList<>();
    }
    return java.util.Arrays.asList(csv.split(","));
}

}

