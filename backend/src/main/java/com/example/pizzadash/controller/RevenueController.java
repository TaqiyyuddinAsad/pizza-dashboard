package com.example.pizzadash.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public List<RevenueDTO> getRevenue() {
        return revenueService.getMonthlyRevenue();
    }
}

