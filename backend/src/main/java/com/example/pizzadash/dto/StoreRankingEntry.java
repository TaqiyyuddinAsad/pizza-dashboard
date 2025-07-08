package com.example.pizzadash.dto;

public class StoreRankingEntry {
    public String storeID;
    public String store;
    public int orders;

    public StoreRankingEntry(String storeID, String store, int orders) {
        this.storeID = storeID;
        this.store = store;
        this.orders = orders;
    }
}
