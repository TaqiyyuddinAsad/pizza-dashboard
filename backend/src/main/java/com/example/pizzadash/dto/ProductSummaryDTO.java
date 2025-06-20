package com.example.pizzadash.dto;

public class ProductSummaryDTO {
    public String sku;
    public String name;
    public double totalRevenue;
    public int totalQuantity;
    public String size;
    public String category;

    public ProductSummaryDTO(String sku, String name, double totalRevenue, int totalQuantity, String size, String category) {
        this.sku = sku;
        this.name = name;
        this.totalRevenue = totalRevenue;
        this.totalQuantity = totalQuantity;
        this.size = size;
        this.category = category;
    }
} 