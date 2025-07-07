package com.example.pizzadash.dto;


public class CustomerCountDTO {
    private String period;
    private int totalCustomers;

    public CustomerCountDTO(String period, int totalCustomers) {
        this.period = period;
        this.totalCustomers = totalCustomers;
    }
    public String getPeriod() { return period; }
    public int getTotalCustomers() { return totalCustomers; }
}