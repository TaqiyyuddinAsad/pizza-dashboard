package com.example.pizzadash.dto;
public class OrdersDTO {
    private String label; // e.g. "Mon", "Tue"
    private int orders;

    public OrdersDTO(String label, int orders) {
        this.label = label;
        this.orders = orders;
    }

    public String getLabel() { return label; }
    public int getOrders() { return orders; }
}