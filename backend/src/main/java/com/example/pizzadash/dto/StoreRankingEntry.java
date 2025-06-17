package com.example.pizzadash.dto;

public class StoreRankingEntry {
    public String store;
    public int orders;

    public StoreRankingEntry(String store, int orders) {
        this.store = store;
        this.orders = orders;
    }
}
