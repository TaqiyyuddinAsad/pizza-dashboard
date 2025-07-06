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
import java.util.ArrayList;
import java.util.Arrays;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    private List<String> splitCsv(String csv) {
        if (csv == null || csv.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(csv.split(","));
    }

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
        @RequestParam(required = false) String stores,
        @RequestParam(required = false) String categories,
        @RequestParam(required = false) String sizes,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        List<String> storesList = splitCsv(stores);
        List<String> categoriesList = splitCsv(categories);
        List<String> sizesList = splitCsv(sizes);
        return productService.getBestseller(start, end, storesList, categoriesList, sizesList, page, size);
    }

    @GetMapping("/combinations")
    public PaginatedResponse<ProductCombinationDTO> getCombinations(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) String stores,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        List<String> storesList = splitCsv(stores);
        return productService.getCombinations(start, end, storesList, page, size);
    }

    @GetMapping("/performance")
    public List<ProductPerformanceDTO> getPerformance(
        @RequestParam String sku,
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) String stores
    ) {
        List<String> storesList = splitCsv(stores);
        return productService.getPerformance(sku, start, end, storesList);
    }

    @GetMapping("/pie-size")
    public List<ProductPieDTO> getPieBySize(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) String stores
    ) {
        List<String> storesList = splitCsv(stores);
        return productService.getPieBySize(start, end, storesList);
    }

    @GetMapping("/summary")
    public ProductSummaryDTO getSummary(
        @RequestParam String sku,
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) String stores
    ) {
        List<String> storesList = splitCsv(stores);
        return productService.getSummary(sku, start, end, storesList);
    }

    @GetMapping("/category-sales")
    public List<CategorySalesDTO> getCategorySales(
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(required = false) String stores,
        @RequestParam(required = false) String sizes
    ) {
        List<String> storesList = splitCsv(stores);
        List<String> sizesList = splitCsv(sizes);
        return productService.getCategorySales(start, end, storesList, sizesList);
    }
}
