package com.example.pizzadash.dto;

public class RevenueSegmentDTO {
    private String label;
    private int count;

    public RevenueSegmentDTO(String label, int count) {
        this.label = label;
        this.count = count;
    }

    public String getLabel() { return label; }
    public int getCount() { return count; }
    public void setLabel(String label) { this.label = label; }
    public void setCount(int count) { this.count = count; }
} 