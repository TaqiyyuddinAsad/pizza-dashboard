package com.example.pizzadash.service;

import com.example.pizzadash.dto.PaginatedResponse;
import com.example.pizzadash.entity.ProductSalesMaterialized;
import com.example.pizzadash.repository.ProductSalesMaterializedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductSalesMaterializedService {
    
    @Autowired
    private ProductSalesMaterializedRepository repository;
    
    /**
     * Get bestsellers by orders with pagination and filtering
     */
    public PaginatedResponse<ProductSalesMaterialized> getBestsellersByOrders(
            String storeId,
            String sku,
            LocalDate startDate,
            LocalDate endDate,
            String category,
            String productSize,
            int page,
            int pageSize) {
        
        List<Object[]> results = repository.findBestsellersByOrdersNative(
                storeId, sku, startDate, endDate, category, productSize);
        
        List<ProductSalesMaterialized> products = convertToProductSalesMaterialized(results);
        
        // Manual pagination
        int totalElements = products.size();
        int startIndex = page * pageSize;
        int endIndex = Math.min(startIndex + pageSize, totalElements);
        
        List<ProductSalesMaterialized> paginatedProducts = new ArrayList<>();
        if (startIndex < totalElements) {
            paginatedProducts = products.subList(startIndex, endIndex);
        }
        
        return new PaginatedResponse<>(paginatedProducts, totalElements);
    }
    
    /**
     * Get worst sellers by orders with pagination and filtering
     */
    public PaginatedResponse<ProductSalesMaterialized> getWorstSellersByOrders(
            String storeId, 
            LocalDate startDate, 
            LocalDate endDate, 
            String category, 
            String productSize, 
            int page, 
            int pageSize) {
        
        List<Object[]> results = repository.findWorstSellersByOrdersNative(
                storeId, startDate, endDate, category, productSize);
        
        List<ProductSalesMaterialized> products = convertToProductSalesMaterialized(results);
        
        // Manual pagination
        int totalElements = products.size();
        int startIndex = page * pageSize;
        int endIndex = Math.min(startIndex + pageSize, totalElements);
        
        List<ProductSalesMaterialized> paginatedProducts = new ArrayList<>();
        if (startIndex < totalElements) {
            paginatedProducts = products.subList(startIndex, endIndex);
        }
        
        return new PaginatedResponse<>(paginatedProducts, totalElements);
    }
    
    /**
     * Get bestsellers by revenue with pagination and filtering
     */
    public PaginatedResponse<ProductSalesMaterialized> getBestsellersByRevenue(
            String storeId, 
            LocalDate startDate, 
            LocalDate endDate, 
            String category, 
            String productSize, 
            int page, 
            int pageSize) {
        
        List<Object[]> results = repository.findBestsellersByRevenueNative(
                storeId, startDate, endDate, category, productSize);
        
        List<ProductSalesMaterialized> products = convertToProductSalesMaterialized(results);
        
        // Manual pagination
        int totalElements = products.size();
        int startIndex = page * pageSize;
        int endIndex = Math.min(startIndex + pageSize, totalElements);
        
        List<ProductSalesMaterialized> paginatedProducts = new ArrayList<>();
        if (startIndex < totalElements) {
            paginatedProducts = products.subList(startIndex, endIndex);
        }
        
        return new PaginatedResponse<>(paginatedProducts, totalElements);
    }
    
    /**
     * Get worst sellers by revenue with pagination and filtering
     */
    public PaginatedResponse<ProductSalesMaterialized> getWorstSellersByRevenue(
            String storeId, 
            LocalDate startDate, 
            LocalDate endDate, 
            String category, 
            String productSize, 
            int page, 
            int pageSize) {
        
        List<Object[]> results = repository.findWorstSellersByRevenueNative(
                storeId, startDate, endDate, category, productSize);
        
        List<ProductSalesMaterialized> products = convertToProductSalesMaterialized(results);
        
        // Manual pagination
        int totalElements = products.size();
        int startIndex = page * pageSize;
        int endIndex = Math.min(startIndex + pageSize, totalElements);
        
        List<ProductSalesMaterialized> paginatedProducts = new ArrayList<>();
        if (startIndex < totalElements) {
            paginatedProducts = products.subList(startIndex, endIndex);
        }
        
        return new PaginatedResponse<>(paginatedProducts, totalElements);
    }
    
    /**
     * Convert Object[] results to ProductSalesMaterialized entities
     */
    private List<ProductSalesMaterialized> convertToProductSalesMaterialized(List<Object[]> results) {
        List<ProductSalesMaterialized> products = new ArrayList<>();
        
        for (Object[] row : results) {
            ProductSalesMaterialized product = new ProductSalesMaterialized();
            product.setProductSku((String) row[0]);
            product.setProductName((String) row[1]);
            product.setProductCategory((String) row[2]);
            product.setProductSize((String) row[3]);
            product.setProductPrice((BigDecimal) row[4]);
            product.setStoreId((String) row[5]);
            product.setStoreCity((String) row[6]);
            product.setStoreState((String) row[7]);
            
            // Handle BigDecimal to Integer conversion for total_orders
            if (row[8] instanceof BigDecimal) {
                product.setTotalOrders(((BigDecimal) row[8]).intValue());
            } else {
                product.setTotalOrders((Integer) row[8]);
            }
            
            product.setTotalRevenue((BigDecimal) row[9]);
            products.add(product);
        }
        
        return products;
    }
    
    /**
     * Get total count for bestsellers
     */
    public long getBestsellersCount(String storeId, LocalDate startDate, LocalDate endDate, 
                                   String category, String productSize) {
        return repository.countByFilters(storeId, startDate, endDate, category, productSize);
    }
    
    /**
     * Get total count for worst sellers
     */
    public long getWorstSellersCount(String storeId, LocalDate startDate, LocalDate endDate, 
                                    String category, String productSize) {
        return repository.countWorstSellersByFilters(storeId, startDate, endDate, category, productSize);
    }
    
    /**
     * Get unique categories from materialized table
     */
    public List<String> getCategories() {
        return repository.findDistinctCategories();
    }
    
    /**
     * Get unique sizes from materialized table
     */
    public List<String> getSizes() {
        return repository.findDistinctSizes();
    }
    
    /**
     * Get unique stores from materialized table
     */
    public List<String> getStores() {
        return repository.findDistinctStores();
    }
    
    /**
     * Get sales summary by store
     */
    public List<Map<String, Object>> getSalesSummaryByStore(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = repository.getSalesSummaryByStore(startDate, endDate);
        
        return results.stream().map(row -> Map.of(
                "storeId", row[0],
                "storeCity", row[1],
                "storeState", row[2],
                "uniqueProducts", row[3],
                "totalOrders", row[4],
                "totalRevenue", row[5]
        )).collect(Collectors.toList());
    }
    
    /**
     * Refresh the materialized table
     * This would typically be called by a scheduled job
     */
    public void refreshMaterializedTable() {
        // This would execute the refresh SQL script
        // In a real implementation, you might use @Scheduled annotation
        // or call a stored procedure
        System.out.println("Materialized table refresh initiated");
    }
    
    public List<Map<String, Object>> getAllProducts() {
        List<Object[]> results = repository.findDistinctProducts();
        List<Map<String, Object>> products = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("sku", (String) row[0]);
            map.put("name", (String) row[1]);
            // Debug print
            System.out.println("[getAllProducts] sizes raw value: " + row[2]);
            if (row[2] instanceof String && row[2] != null && !((String) row[2]).isEmpty()) {
                map.put("sizes", java.util.Arrays.asList(((String) row[2]).split(",")));
            } else {
                map.put("sizes", new java.util.ArrayList<String>());
            }
            products.add(map);
        }
        return products;
    }
    
    public List<Map<String, Object>> getProductPerformanceAfterLaunch(String sku, int days, String size, String storeId) {
        List<Object[]> results = repository.getProductPerformanceAfterLaunch(sku, days, size, storeId);
        List<Map<String, Object>> performance = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("period", "Woche " + row[0]);
            map.put("quantity", row[1]);
            map.put("revenue", row[2]);
            performance.add(map);
        }
        return performance;
    }
} 