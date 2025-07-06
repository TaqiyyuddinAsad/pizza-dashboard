package com.example.pizzadash.dto;

public class ProductPerformanceDTO {
    public String period;
    public double revenue;
    public int quantity;

    public ProductPerformanceDTO(String period, double revenue, int quantity) {
        this.period = period;
        this.revenue = revenue;
        this.quantity = quantity;
    }
} 