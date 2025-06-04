package com.example.pizzadash.entity;
import java.math.BigDecimal;


public class customer
{
	private String customerID;
	private BigDecimal latitude;
	private BigDecimal longitude;

	public String getcustomerID()
	{
		return this.customerID;
	}
	public void setcustomerID(String value)
	{
		this.customerID = value;
	}
	public BigDecimal getlatitude()
	{
		return this.latitude;
	}
	public void setlatitude(BigDecimal value)
	{
		this.latitude = value; }

	public BigDecimal getlongitude()
	{
		return this.longitude;
	}
	public void setlongitude(BigDecimal value)
	{
		this.longitude = value;
	}


	public customer(String customerID_,BigDecimal latitude_,BigDecimal longitude_)
	{
		this.customerID = customerID_;
		this.latitude = latitude_;
		this.longitude = longitude_;
	}
}
