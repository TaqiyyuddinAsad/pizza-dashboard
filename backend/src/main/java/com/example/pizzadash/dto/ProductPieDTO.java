package com.example.pizzadash.dto;

public class ProductPieDTO {
    public String size;
    public int count;
    public double percent;

    public ProductPieDTO(String size, int count, double percent) {
        this.size = size;
        this.count = count;
        this.percent = percent;
    }
} 