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
import com.example.pizzadash.dto.CategorySalesDTO;
import com.example.pizzadash.dto.PaginatedResponse;

@Service
public class ProductService {
    @Autowired
    private AnalyticsRepository analyticsRepository;

    public PaginatedResponse<ProductBestsellerDTO> getBestseller(String start, String end, List<String> stores, List<String> categories, List<String> sizes, int page, int size) {
        int offset = (page - 1) * size;
        List<ProductBestsellerDTO> data = analyticsRepository.getBestseller(start, end, stores, categories, sizes, size, offset);
        int total = analyticsRepository.getBestsellerCount(start, end, stores, categories, sizes);
        return new PaginatedResponse<>(data, total);
    }

    public PaginatedResponse<ProductCombinationDTO> getCombinations(String start, String end, List<String> stores, int page, int size) {
        List<ProductCombinationDTO> data = analyticsRepository.getBestCombinations(start, end, stores, page, size);
        int total = analyticsRepository.getCombinationsCount(start, end, stores);
        return new PaginatedResponse<>(data, total);
    }

    public List<ProductPerformanceDTO> getPerformance(String sku, String start, String end, List<String> stores) {
        return analyticsRepository.getPerformanceAfterLaunch(sku, start, end, stores);
    }
    public List<ProductPieDTO> getPieBySize(String start, String end, List<String> stores) {
        return analyticsRepository.getPieBySize(start, end, stores);
    }
    public ProductSummaryDTO getSummary(String sku, String start, String end, List<String> stores) {
        // TODO: Query für Summary
        return null;
    }
    public List<CategorySalesDTO> getCategorySales(String start, String end, List<String> stores, List<String> sizes) {
        return analyticsRepository.getCategorySales(start, end, stores, sizes);
    }
}
