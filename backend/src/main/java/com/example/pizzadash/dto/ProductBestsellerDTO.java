package com.example.pizzadash.dto;

public class ProductBestsellerDTO {
    public String sku;
    public String name;
    public String imageUrl;
    public double price;
    public String size;
    public int orders;
    public double revenue;

    public ProductBestsellerDTO(String sku, String name, String imageUrl, double price, String size, int orders, double revenue) {
        this.sku = sku;
        this.name = name;
        this.imageUrl = imageUrl;
        this.price = price;
        this.size = size;
        this.orders = orders;
        this.revenue = revenue;
    }
} 