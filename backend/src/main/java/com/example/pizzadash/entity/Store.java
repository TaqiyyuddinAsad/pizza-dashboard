package com.example.pizzadash.entity;
import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "stores")
public class Store
{
	private String storeID;
	public String getstoreID()
	{
		return this.storeID;
	}
	public void setstoreID(String value)
	{
		this.storeID = value;
	}

	private String zipcode;
	public String getzipcode()
	{
		return this.zipcode;
	}
	public void setzipcode(String value)
	{
		this.zipcode = value;
	}

	private String state_abbr;
	public String getstate_abbr()
	{
		return this.state_abbr;
	}
	public void setstate_abbr(String value)
	{
		this.state_abbr = value;
	}

	private BigDecimal latitude;
	public BigDecimal getlatitude()
	{
		return this.latitude;
	}
	public void setlatitude(BigDecimal value)
	{
		this.latitude = value;
	}

	private BigDecimal longitude;
	public BigDecimal getlongitude()
	{
		return this.longitude;
	}
	public void setlongitude(BigDecimal value)
	{
		this.longitude = value;
	}

	private String city;
	public String getcity()
	{
		return this.city;
	}
	public void setcity(String value)
	{
		this.city = value;
	}

	private String state;
	public String getstate()
	{
		return this.state;
	}
	public void setstate(String value)
	{
		this.state = value;
	}

	private BigDecimal distance;
	public BigDecimal getdistance()
	{
		return this.distance;
	}
	public void setdistance(BigDecimal value)
	{
		this.distance = value;
	}


	public Store(String storeID_,String zipcode_,String state_abbr_,BigDecimal latitude_,BigDecimal longitude_,String city_,String state_,BigDecimal distance_)
	{
		this.storeID = storeID_;
		this.zipcode = zipcode_;
		this.state_abbr = state_abbr_;
		this.latitude = latitude_;
		this.longitude = longitude_;
		this.city = city_;
		this.state = state_;
		this.distance = distance_;
	}
}