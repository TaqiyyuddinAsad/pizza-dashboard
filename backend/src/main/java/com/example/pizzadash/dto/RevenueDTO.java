package com.example.pizzadash.dto;
import java.math.BigDecimal;
public class RevenueDTO {
    private String label;
    private BigDecimal revenue;

    public RevenueDTO(String label, BigDecimal revenue) {
        this.label = label;
        this.revenue = revenue;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }
}
