package com.example.pizzadash.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ingredients") // Falls deine DB-Tabelle "ingredients" heißt
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredientID") // Falls deine Spalte so heißt
    private Long id;

    @Column(name = "name") // optional, falls gleich
    private String name;

    // === Konstruktoren ===
    public Ingredient() {
    }

    public Ingredient(String name) {
        this.name = name;
    }

    // === Getter & Setter ===
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
