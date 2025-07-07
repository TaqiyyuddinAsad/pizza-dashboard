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
import com.example.pizzadash.dto.StoreProductSalesDTO;
import com.example.pizzadash.repository.ProductSalesMaterializedRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Map;

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
        return null;
    }
    public List<CategorySalesDTO> getCategorySales(String start, String end, List<String> stores, List<String> sizes) {
        return analyticsRepository.getCategorySales(start, end, stores, sizes);
    }

    public List<ProductBestsellerDTO> getProductsByFlexibleFilter(String start, String end, String productNamePattern, String size, List<String> stores, List<String> categories) {
        return analyticsRepository.getProductsByFlexibleFilter(start, end, productNamePattern, size, stores, categories);
    }

    public List<Map<String, Object>> getProductSearchResults(String start, String end, String searchTerm, List<String> stores) {
        return analyticsRepository.getProductSearchResults(start, end, searchTerm, stores);
    }

    @Autowired
    private ProductSalesMaterializedRepository productSalesMaterializedRepository;

    public List<StoreProductSalesDTO> getBestStoresForProduct(String sku, String size, String start, String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        List<Object[]> rows = productSalesMaterializedRepository.findStoresForProductByRevenue(sku, size, startDate, endDate);
        List<StoreProductSalesDTO> result = new ArrayList<>();
        for (Object[] row : rows) {
            result.add(new StoreProductSalesDTO(
                (String) row[0], // storeId
                (String) row[1], // storeCity
                ((Number) row[2]).intValue(), // orders
                ((Number) row[3]).doubleValue() // revenue
            ));
        }
        return result;
    }
}
