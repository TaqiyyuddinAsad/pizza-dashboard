package com.example.pizzadash.dto;

public class CategorySalesDTO {
    private String category;
    private int quantity;
    private double revenue;

    public CategorySalesDTO(String category, int quantity, double revenue) {
        this.category = category;
        this.quantity = quantity;
        this.revenue = revenue;
    }

    public String getCategory() { return category; }
    public int getQuantity() { return quantity; }
    public double getRevenue() { return revenue; }
} 