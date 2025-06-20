package com.example.pizzadash.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.pizzadash.repository.AnalyticsRepository;
import com.example.pizzadash.dto.ProductBestsellerDTO;
import com.example.pizzadash.dto.ProductCombinationDTO;
import com.example.pizzadash.dto.ProductPerformanceDTO;
import com.example.pizzadash.dto.ProductPieDTO;
import com.example.pizzadash.dto.ProductSummaryDTO;

@Service
public class ProductService {
    @Autowired
    private AnalyticsRepository analyticsRepository;

    public List<ProductBestsellerDTO> getBestseller(String start, String end, List<String> stores, List<String> categories, List<String> sizes) {
        // TODO: Query für Bestseller
        return List.of();
    }
    public List<ProductCombinationDTO> getCombinations(String start, String end, List<String> stores) {
        // TODO: Query für Kombinationen
        return List.of();
    }
    public List<ProductPerformanceDTO> getPerformance(String sku, String start, String end, List<String> stores) {
        // TODO: Query für Performance
        return List.of();
    }
    public List<ProductPieDTO> getPieBySize(String start, String end, List<String> stores) {
        // TODO: Query für Piechart nach Größe
        return List.of();
    }
    public ProductSummaryDTO getSummary(String sku, String start, String end, List<String> stores) {
        // TODO: Query für Summary
        return null;
    }
}
