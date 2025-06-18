package com.example.pizzadash.dto;

public class OrderTimeDTO {
    private String zeitpunkt;
    private long anzahl;

    public String getZeitpunkt() {
        return zeitpunkt;
    }

    public void setZeitpunkt(String zeitpunkt) {
        this.zeitpunkt = zeitpunkt;
    }

    public long getAnzahl() {
        return anzahl;
    }

    public void setAnzahl(long anzahl) {
        this.anzahl = anzahl;
    }
}

