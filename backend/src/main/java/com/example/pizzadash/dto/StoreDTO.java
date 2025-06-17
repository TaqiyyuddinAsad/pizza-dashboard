package com.example.pizzadash.dto;

public class StoreDTO {
    public String store;
    public int orders;
    public int rankNow;
    public Integer rankBefore;
    public String trend;

    public StoreDTO(String store, int orders, int rankNow, Integer rankBefore, String trend) {
        this.store = store;
        this.orders = orders;
        this.rankNow = rankNow;
        this.rankBefore = rankBefore;
        this.trend = trend;
    }
}