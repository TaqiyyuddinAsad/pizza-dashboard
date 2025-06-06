package com.example.pizzadash.dto;

import java.math.BigDecimal;

public class RevenueDTO {
    private String month;
    private BigDecimal revenue;

    public RevenueDTO(String month, BigDecimal revenue) {
        this.month = month;
        this.revenue = revenue;
    }

    public String getMonth() {
        return month;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

public RevenueDTO() {} 
}
