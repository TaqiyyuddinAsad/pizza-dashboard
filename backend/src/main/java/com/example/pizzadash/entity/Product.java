package com.example.pizzadash.entity;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

@Entity

@Table(name = "products")
public class Product
{

	@Id
	private String sku;
	public String getSKU()
	{
		return this.sku;
	}
	public void setSKU(String value)
	{
		this.sku = value;
	}

	private String name;
	public String getName()
	{
		return this.name;
	}
	public void setName(String value)
	{
		this.name = value;
	}

	private BigDecimal price;
	public BigDecimal getPrice()
	{
		return this.price;
	}
	public void setPrice(BigDecimal value)
	{
		this.price = value;
	}

	private String category;
	public String getCategory()
	{
		return this.category;
	}
	public void setCategory(String value)
	{
		this.category = value;
	}

	private String size;
	public String getSize()
	{
		return this.size;
	}
	public void setSize(String value)
	{
		this.size = value;
	}

	private String ingredients;
	public String getIngredients()
	{
		return this.ingredients;
	}
	public void setIngredients(String value)
	{
		this.ingredients = value;
	}

	private java.sql.Date launch;
	public java.sql.Date getLaunch()
	{
		return this.launch;
	}
	public void setLaunch(java.sql.Date value)
	{
		this.launch = value;
	}

	@ManyToMany
    @JoinTable(
        name = "pizza_ingredients",
        joinColumns = @JoinColumn(name = "SKU"),
        inverseJoinColumns = @JoinColumn(name = "ingredientID")
    )

	 private Set<Ingredient> ingredientsSet = new HashSet<>();

	@ManyToMany(mappedBy = "products")
	private Set<Order> orders;
}
