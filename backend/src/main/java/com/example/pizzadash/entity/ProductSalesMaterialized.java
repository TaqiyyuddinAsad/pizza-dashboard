package com.example.pizzadash.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_bestsellers_store_materialized")
public class ProductSalesMaterialized {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_sku", nullable = false, length = 10)
    private String productSku;
    
    @Column(name = "product_name", length = 100)
    private String productName;
    
    @Column(name = "product_category", length = 50)
    private String productCategory;
    
    @Column(name = "product_size", length = 50)
    private String productSize;
    
    @Column(name = "product_price", precision = 6, scale = 2)
    private BigDecimal productPrice;
    
    @Column(name = "store_id", length = 10)
    private String storeId;
    
    @Column(name = "store_city", length = 100)
    private String storeCity;
    
    @Column(name = "store_state", length = 100)
    private String storeState;
    
    @Column(name = "sale_date")
    private LocalDate saleDate;
    
    @Column(name = "total_orders")
    private Integer totalOrders;
    
    @Column(name = "total_revenue", precision = 10, scale = 2)
    private BigDecimal totalRevenue;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public ProductSalesMaterialized() {}
    
    public ProductSalesMaterialized(String productSku, String productName, String productCategory, 
                                   String productSize, BigDecimal productPrice, String storeId, 
                                   String storeCity, String storeState, LocalDate saleDate, 
                                   Integer totalOrders, BigDecimal totalRevenue) {
        this.productSku = productSku;
        this.productName = productName;
        this.productCategory = productCategory;
        this.productSize = productSize;
        this.productPrice = productPrice;
        this.storeId = storeId;
        this.storeCity = storeCity;
        this.storeState = storeState;
        this.saleDate = saleDate;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getProductSku() {
        return productSku;
    }
    
    public void setProductSku(String productSku) {
        this.productSku = productSku;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public void setProductName(String productName) {
        this.productName = productName;
    }
    
    public String getProductCategory() {
        return productCategory;
    }
    
    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }
    
    public String getProductSize() {
        return productSize;
    }
    
    public void setProductSize(String productSize) {
        this.productSize = productSize;
    }
    
    public BigDecimal getProductPrice() {
        return productPrice;
    }
    
    public void setProductPrice(BigDecimal productPrice) {
        this.productPrice = productPrice;
    }
    
    public String getStoreId() {
        return storeId;
    }
    
    public void setStoreId(String storeId) {
        this.storeId = storeId;
    }
    
    public String getStoreCity() {
        return storeCity;
    }
    
    public void setStoreCity(String storeCity) {
        this.storeCity = storeCity;
    }
    
    public String getStoreState() {
        return storeState;
    }
    
    public void setStoreState(String storeState) {
        this.storeState = storeState;
    }
    
    public LocalDate getSaleDate() {
        return saleDate;
    }
    
    public void setSaleDate(LocalDate saleDate) {
        this.saleDate = saleDate;
    }
    
    public Integer getTotalOrders() {
        return totalOrders;
    }
    
    public void setTotalOrders(Integer totalOrders) {
        this.totalOrders = totalOrders;
    }
    
    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
    
    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
} 