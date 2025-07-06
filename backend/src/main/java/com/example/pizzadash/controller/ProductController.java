package com.example.pizzadash.controller;

import com.example.pizzadash.dto.RankedProduct;
import com.example.pizzadash.dto.RankingEntry;
import com.example.pizzadash.service.OrderService;
import com.example.pizzadash.service.ProductService;
import com.example.pizzadash.dto.ProductBestsellerDTO;
import com.example.pizzadash.dto.ProductCombinationDTO;
import com.example.pizzadash.dto.ProductPerformanceDTO;
import com.example.pizzadash.dto.ProductPieDTO;
import com.example.pizzadash.dto.ProductSummaryDTO;
import com.example.pizzadash.dto.CategorySalesDTO;
import com.example.pizzadash.dto.PaginatedResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

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

    @GetMapping("/bestseller")
    public PaginatedResponse<ProductBestsellerDTO> getBestseller(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) List<String> stores,
        @RequestParam(required = false) List<String> categories,
        @RequestParam(required = false) List<String> sizes,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return productService.getBestseller(start, end, stores, categories, sizes, page, size);
    }

    @GetMapping("/combinations")
    public PaginatedResponse<ProductCombinationDTO> getCombinations(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) List<String> stores,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return productService.getCombinations(start, end, stores, page, size);
    }

    @GetMapping("/performance")
    public List<ProductPerformanceDTO> getPerformance(
        @RequestParam String sku,
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) List<String> stores
    ) {
        return productService.getPerformance(sku, start, end, stores);
    }

    @GetMapping("/pie-size")
    public List<ProductPieDTO> getPieBySize(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) List<String> stores
    ) {
        return productService.getPieBySize(start, end, stores);
    }

    @GetMapping("/summary")
    public ProductSummaryDTO getSummary(
        @RequestParam String sku,
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) List<String> stores
    ) {
        return productService.getSummary(sku, start, end, stores);
    }

    @GetMapping("/category-sales")
    public List<CategorySalesDTO> getCategorySales(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) List<String> stores,
        @RequestParam(required = false) List<String> sizes
    ) {
        return productService.getCategorySales(start, end, stores, sizes);
    }
}
