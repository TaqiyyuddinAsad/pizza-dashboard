package com.example.pizzadash.dto;

public class RevenuePerCustomerDTO {
    private String period;
    private double avgRevenuePerCustomer;

    public RevenuePerCustomerDTO(String period, double avgRevenuePerCustomer) {
        this.period = period;
        this.avgRevenuePerCustomer = avgRevenuePerCustomer;
    }
    public String getPeriod() { return period; }
    public double getAvgRevenuePerCustomer() { return avgRevenuePerCustomer; }
}
