package com.example.pizzadash.dto;



public class RankedProduct {
    public String product;
    public int orders;
    public int rankNow;
    public Integer rankBefore;
    public String trend;

    public RankedProduct(String product, int orders, int rankNow, Integer rankBefore, String trend) {
        this.product = product;
        this.orders = orders;
        this.rankNow = rankNow;
        this.rankBefore = rankBefore;
        this.trend = trend;
    }
}
