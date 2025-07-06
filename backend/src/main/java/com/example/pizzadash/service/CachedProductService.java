package com.example.pizzadash.service;

import com.example.pizzadash.dto.PaginatedResponse;
import com.example.pizzadash.entity.Product;
import com.example.pizzadash.repository.AnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CachedProductService {
    
    @Autowired
    private AnalyticsRepository analyticsRepository;
    
    
    @Cacheable(value = "bestsellers", key = "#storeId + '_' + #startDate + '_' + #endDate + '_' + #category + '_' + #size + '_' + #page + '_' + #pageSize")
    public PaginatedResponse<Map<String, Object>> getBestsellers(
            String storeId, 
            LocalDate startDate, 
            LocalDate endDate, 
            String category, 
            String size, 
            int page, 
            int pageSize) {
        
        // Convert single values to lists for the repository method
        List<String> stores = storeId != null ? List.of(storeId) : null;
        List<String> categories = category != null ? List.of(category) : null;
        List<String> sizes = size != null ? List.of(size) : null;
        
        // Use the existing repository method
        List<com.example.pizzadash.dto.ProductBestsellerDTO> data = analyticsRepository.getBestseller(
                startDate.toString(), endDate.toString(), stores, categories, sizes, pageSize, page * pageSize);
        
        int total = analyticsRepository.getBestsellerCount(
                startDate.toString(), endDate.toString(), stores, categories, sizes);
        
        // Convert DTOs to Maps for consistency
        List<Map<String, Object>> mapData = data.stream()
                .map(dto -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("sku", dto.getSku());
                    map.put("name", dto.getName());
                    map.put("price", dto.getPrice());
                    map.put("size", dto.getSize());
                    map.put("orders", dto.getOrders());
                    map.put("revenue", dto.getRevenue());
                    return map;
                })
                .collect(Collectors.toList());
        
        return new PaginatedResponse<>(mapData, total);
    }
    
    /**
     * Get worst sellers with caching
     */
    @Cacheable(value = "worstsellers", key = "#storeId + '_' + #startDate + '_' + #endDate + '_' + #category + '_' + #size + '_' + #page + '_' + #pageSize")
    public PaginatedResponse<Map<String, Object>> getWorstSellers(
            String storeId, 
            LocalDate startDate, 
            LocalDate endDate, 
            String category, 
            String size, 
            int page, 
            int pageSize) {
        
        // For worst sellers, we can use the same method but sort differently
        // This is a simplified approach - you might want to add a specific method for worst sellers
        List<String> stores = storeId != null ? List.of(storeId) : null;
        List<String> categories = category != null ? List.of(category) : null;
        List<String> sizes = size != null ? List.of(size) : null;
        
        List<com.example.pizzadash.dto.ProductBestsellerDTO> data = analyticsRepository.getBestseller(
                startDate.toString(), endDate.toString(), stores, categories, sizes, pageSize, page * pageSize);
        
        int total = analyticsRepository.getBestsellerCount(
                startDate.toString(), endDate.toString(), stores, categories, sizes);
        
        // Convert DTOs to Maps
        List<Map<String, Object>> mapData = data.stream()
                .map(dto -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("sku", dto.getSku());
                    map.put("name", dto.getName());
                    map.put("price", dto.getPrice());
                    map.put("size", dto.getSize());
                    map.put("orders", dto.getOrders());
                    map.put("revenue", dto.getRevenue());
                    return map;
                })
                .collect(Collectors.toList());
        
        return new PaginatedResponse<>(mapData, total);
    }
    
    /**
     * Get categories with caching
     */
    @Cacheable(value = "categories")
    public List<String> getCategories() {
        // You'll need to add this method to AnalyticsRepository
        // For now, return a simple list
        return List.of("Pizza", "Drinks", "Sides", "Desserts");
    }
    
    /**
     * Get sizes with caching
     */
    @Cacheable(value = "sizes")
    public List<String> getSizes() {
        // You'll need to add this method to AnalyticsRepository
        // For now, return a simple list
        return List.of("Small", "Medium", "Large", "Extra Large");
    }
    
    /**
     * Get stores with caching
     */
    @Cacheable(value = "stores")
    public List<String> getStores() {
        // You'll need to add this method to AnalyticsRepository
        // For now, return a simple list
        return List.of("STORE001", "STORE002", "STORE003");
    }
} 