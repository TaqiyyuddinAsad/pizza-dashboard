package com.example.pizzadash.controller;

import com.example.pizzadash.dto.PaginatedResponse;
import com.example.pizzadash.entity.ProductSalesMaterialized;
import com.example.pizzadash.service.ProductSalesMaterializedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/materialized")
@CrossOrigin(origins = "*")
public class ProductSalesMaterializedController {
    
    @Autowired
    private ProductSalesMaterializedService service;
    
    /**
     * Get bestsellers by orders with pagination and filtering
     */
    @GetMapping("/bestsellers/orders")
    public ResponseEntity<PaginatedResponse<ProductSalesMaterialized>> getBestsellersByOrders(
            @RequestParam(required = false) String storeId,
            @RequestParam(required = false) String sku,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        
        PaginatedResponse<ProductSalesMaterialized> response = service.getBestsellersByOrders(
                storeId, sku, startDate, endDate, category, size, page, pageSize);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get worst sellers by orders with pagination and filtering
     */
    @GetMapping("/worst-sellers/orders")
    public ResponseEntity<PaginatedResponse<ProductSalesMaterialized>> getWorstSellersByOrders(
            @RequestParam(required = false) String storeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        
        PaginatedResponse<ProductSalesMaterialized> response = service.getWorstSellersByOrders(
                storeId, startDate, endDate, category, size, page, pageSize);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get bestsellers by revenue with pagination and filtering
     */
    @GetMapping("/bestsellers/revenue")
    public ResponseEntity<PaginatedResponse<ProductSalesMaterialized>> getBestsellersByRevenue(
            @RequestParam(required = false) String storeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        
        PaginatedResponse<ProductSalesMaterialized> response = service.getBestsellersByRevenue(
                storeId, startDate, endDate, category, size, page, pageSize);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get worst sellers by revenue with pagination and filtering
     */
    @GetMapping("/worst-sellers/revenue")
    public ResponseEntity<PaginatedResponse<ProductSalesMaterialized>> getWorstSellersByRevenue(
            @RequestParam(required = false) String storeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        
        PaginatedResponse<ProductSalesMaterialized> response = service.getWorstSellersByRevenue(
                storeId, startDate, endDate, category, size, page, pageSize);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get unique categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = service.getCategories();
        return ResponseEntity.ok(categories);
    }
    
    /**
     * Get unique sizes
     */
    @GetMapping("/sizes")
    public ResponseEntity<List<String>> getSizes() {
        List<String> sizes = service.getSizes();
        return ResponseEntity.ok(sizes);
    }
    
    /**
     * Get unique stores
     */
    @GetMapping("/stores")
    public ResponseEntity<List<String>> getStores() {
        List<String> stores = service.getStores();
        return ResponseEntity.ok(stores);
    }
    
    /**
     * Get sales summary by store
     */
    @GetMapping("/sales-summary")
    public ResponseEntity<List<Map<String, Object>>> getSalesSummaryByStore(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<Map<String, Object>> summary = service.getSalesSummaryByStore(startDate, endDate);
        return ResponseEntity.ok(summary);
    }
    
    /**
     * Refresh materialized table (admin endpoint)
     */
    @PostMapping("/refresh")
    public ResponseEntity<String> refreshMaterializedTable() {
        service.refreshMaterializedTable();
        return ResponseEntity.ok("Materialized table refresh initiated");
    }
    
    /**
     * Get all unique products (SKU and name)
     */
    @GetMapping("/products")
    public ResponseEntity<List<Map<String, Object>>> getAllProducts() {
        return ResponseEntity.ok(service.getAllProducts());
    }
    
    /**
     * Get product performance after launch (time series)
     */
    @GetMapping("/performance")
    public ResponseEntity<List<Map<String, Object>>> getProductPerformanceAfterLaunch(
        @RequestParam String sku,
        @RequestParam int days,
        @RequestParam(required = false) String size,
        @RequestParam(required = false) String storeId
    ) {
        return ResponseEntity.ok(service.getProductPerformanceAfterLaunch(sku, days, size, storeId));
    }
} 