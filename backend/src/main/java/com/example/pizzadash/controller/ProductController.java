package com.example.pizzadash.controller;

import com.example.pizzadash.dto.RankedProduct;
import com.example.pizzadash.dto.RankingEntry;
import com.example.pizzadash.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/ranking")
    public List<RankedProduct> getProductRankingWithTrend(
        @RequestParam String start,
        @RequestParam String end
    ) {
       LocalDate currentStart = LocalDate.parse(start.trim());
        LocalDate currentEnd = LocalDate.parse(end.trim());
        long days = ChronoUnit.DAYS.between(currentStart, currentEnd) + 1;

        LocalDate previousStart = currentStart.minusDays(days);
        LocalDate previousEnd = currentStart.minusDays(1);

        List<RankingEntry> previous = orderService.getProductRanking(previousStart, previousEnd);
        List<RankingEntry> current = orderService.getProductRanking(currentStart, currentEnd);

        return orderService.compareRankings(previous, current);
    }
}
