package com.example.pizzadash.dto;

public class ProductBestsellerDTO {
    private String sku;
    private String name;
    private double price;
    private String size;
    private int orders;
    private double revenue;

    public ProductBestsellerDTO(String sku, String name, double price, String size, int orders, double revenue) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.size = size;
        this.orders = orders;
        this.revenue = revenue;
    }

    public String getSku() { return sku; }
    public String getName() { return name; }
    public double getPrice() { return price; }
    public String getSize() { return size; }
    public int getOrders() { return orders; }
    public double getRevenue() { return revenue; }
} 