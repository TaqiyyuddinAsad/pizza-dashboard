package com.example.pizzadash.dto;

public class StoreProductSalesDTO {
    private String storeId;
    private String storeCity;
    private int orders;
    private double revenue;

    public StoreProductSalesDTO(String storeId, String storeCity, int orders, double revenue) {
        this.storeId = storeId;
        this.storeCity = storeCity;
        this.orders = orders;
        this.revenue = revenue;
    }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getStoreCity() { return storeCity; }
    public void setStoreCity(String storeCity) { this.storeCity = storeCity; }

    public int getOrders() { return orders; }
    public void setOrders(int orders) { this.orders = orders; }

    public double getRevenue() { return revenue; }
    public void setRevenue(double revenue) { this.revenue = revenue; }
} 