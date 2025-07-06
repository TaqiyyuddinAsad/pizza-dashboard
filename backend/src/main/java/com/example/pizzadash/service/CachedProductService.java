package com.example.pizzadash.service;

import com.example.pizzadash.dto.PaginatedResponse;

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
        
       
        List<String> stores = storeId != null ? List.of(storeId) : null;
        List<String> categories = category != null ? List.of(category) : null;
        List<String> sizes = size != null ? List.of(size) : null;
        
        
        List<com.example.pizzadash.dto.ProductBestsellerDTO> data = analyticsRepository.getBestseller(
                startDate.toString(), endDate.toString(), stores, categories, sizes, pageSize, page * pageSize);
        
        int total = analyticsRepository.getBestsellerCount(
                startDate.toString(), endDate.toString(), stores, categories, sizes);
        
        
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
    
  
    @Cacheable(value = "worstsellers", key = "#storeId + '_' + #startDate + '_' + #endDate + '_' + #category + '_' + #size + '_' + #page + '_' + #pageSize")
    public PaginatedResponse<Map<String, Object>> getWorstSellers(
            String storeId, 
            LocalDate startDate, 
            LocalDate endDate, 
            String category, 
            String size, 
            int page, 
            int pageSize) {
        
        
        List<String> stores = storeId != null ? List.of(storeId) : null;
        List<String> categories = category != null ? List.of(category) : null;
        List<String> sizes = size != null ? List.of(size) : null;
        
        List<com.example.pizzadash.dto.ProductBestsellerDTO> data = analyticsRepository.getBestseller(
                startDate.toString(), endDate.toString(), stores, categories, sizes, pageSize, page * pageSize);
        
        int total = analyticsRepository.getBestsellerCount(
                startDate.toString(), endDate.toString(), stores, categories, sizes);
        
       
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
    
  
    @Cacheable(value = "categories")
    public List<String> getCategories() {
        
        return List.of("Pizza", "Drinks", "Sides", "Desserts");
    }
    

   
} 