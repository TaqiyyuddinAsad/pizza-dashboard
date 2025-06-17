package com.example.pizzadash.dto;



public class RankingEntry {
    public String product;
    public int orders;

    public RankingEntry(String product, int orders) {
        this.product = product;
        this.orders = orders;
    }
}
