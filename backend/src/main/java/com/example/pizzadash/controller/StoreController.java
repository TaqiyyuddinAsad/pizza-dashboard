package com.example.pizzadash.controller;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pizzadash.dto.StoreDTO;
import com.example.pizzadash.dto.StoreRankingEntry;
import com.example.pizzadash.service.OrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/stores")
public class StoreController {

    @Autowired
    private OrderService orderService;

    
   
    @GetMapping("/ranking")
    public List<StoreDTO> getStoreRankingWithTrend(
        @RequestParam String start,
        @RequestParam String end
    ) {
        LocalDate currentStart = LocalDate.parse(start.trim());
        LocalDate currentEnd = LocalDate.parse(end.trim());
        long days = ChronoUnit.DAYS.between(currentStart, currentEnd) + 1;

        LocalDate previousStart = currentStart.minusDays(days);
        LocalDate previousEnd = currentStart.minusDays(1);

        List<StoreRankingEntry> previous = orderService.getStoreRanking(previousStart, previousEnd);
        List<StoreRankingEntry> current = orderService.getStoreRanking(currentStart, currentEnd);

        return orderService.compareStoreRankings(previous, current);
    }
}
