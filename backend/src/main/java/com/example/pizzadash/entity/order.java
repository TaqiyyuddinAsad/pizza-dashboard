package com.example.pizzadash.entity;
import java.math.BigDecimal;
public class order
{
	private int orderID;
	public int getorderID()
	{
		return this.orderID;
	}
	public void setorderID(int value)
	{
		this.orderID = value;
	}

	private String customerID;
	public String getcustomerID()
	{
		return this.customerID;
	}
	public void setcustomerID(String value)
	{
		this.customerID = value;
	}

	private String storeID;
	public String getstoreID()
	{
		return this.storeID;
	}
	public void setstoreID(String value)
	{
		this.storeID = value;
	}

	private java.sql.Date orderDate;
	public java.sql.Date getorderDate()
	{
		return this.orderDate;
	}
	public void setorderDate(java.sql.Date value)
	{
		this.orderDate = value;
	}

	private int nItems;
	public int getnItems()
	{
		return this.nItems;
	}
	public void setnItems(int value)
	{
		this.nItems = value;
	}

	private BigDecimal total;
	public BigDecimal gettotal()
	{
		return this.total;
	}
	public void settotal(BigDecimal value)
	{
		this.total = value;
	}


	public order(int orderID_,String customerID_,String storeID_,java.sql.Date orderDate_,int nItems_,BigDecimal total_)
	{
		this.orderID = orderID_;
		this.customerID = customerID_;
		this.storeID = storeID_;
		this.orderDate = orderDate_;
		this.nItems = nItems_;
		this.total = total_;
	}
}
